import { useEffect, useState, useCallback } from "react"
import {
  subscribeToPayroll,
  getPayrollBaseline,
  addPayee as fsAddPayee,
  updatePayeeCompensation as fsUpdatePayeeCompensation,
  deletePayee as fsDeletePayee,
  addSubscription as fsAddSubscription,
  updateSubscriptionStatus as fsUpdateSubscriptionStatus,
  processPayrollRunSimulation as fsProcessPayrollRunSimulation,
  type PayrollData,
  type PayeeItem,
  type SubscriptionItem,
} from "@/lib/admin/payrollService"

export function usePayrollData() {
  const [data, setData] = useState<PayrollData>(() => getPayrollBaseline())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    let active = true

    const unsubscribe = subscribeToPayroll(
      (freshData) => {
        if (!active) return
        setData(freshData)
        setLoading(false)
        setError(null)
        setIsLive(true)
      },
      (err) => {
        if (!active) return
        console.error("Firestore payroll subscription error:", err)
        setError("Failed to connect to real-time payroll database. Showing cached records.")
        setLoading(false)
        setIsLive(false)
      }
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const addPayee = useCallback(async (payee: Omit<PayeeItem, "id">) => {
    try {
      await fsAddPayee(payee)
    } catch (err: any) {
      console.error("Failed to add payee:", err)
      throw err
    }
  }, [])

  const updateCompensation = useCallback(
    async (code: string, updates: Partial<PayeeItem>) => {
      try {
        await fsUpdatePayeeCompensation(code, updates)
      } catch (err: any) {
        console.error("Failed to update compensation:", err)
        throw err
      }
    },
    []
  )

  const deletePayee = useCallback(async (code: string, name: string) => {
    try {
      await fsDeletePayee(code, name)
    } catch (err: any) {
      console.error("Failed to delete payee:", err)
      throw err
    }
  }, [])

  const addSubscription = useCallback(
    async (sub: Omit<SubscriptionItem, "id">) => {
      try {
        await fsAddSubscription(sub)
      } catch (err: any) {
        console.error("Failed to add subscription:", err)
        throw err
      }
    },
    []
  )

  const updateSubscriptionStatus = useCallback(
    async (
      id: string,
      status: "due_soon" | "scheduled" | "pending_auth",
      dueLabel: string
    ) => {
      try {
        await fsUpdateSubscriptionStatus(id, status, dueLabel)
      } catch (err: any) {
        console.error("Failed to update subscription status:", err)
        throw err
      }
    },
    []
  )

  const processPayrollRun = useCallback(async () => {
    setLoading(true)
    try {
      await fsProcessPayrollRunSimulation(
        data.kpis.corePayroll,
        data.kpis.totalStaffCount
      )
    } catch (err: any) {
      console.error("Failed to execute payroll run:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [data.kpis.corePayroll, data.kpis.totalStaffCount])

  return {
    data,
    loading,
    error,
    isLive,
    addPayee,
    updateCompensation,
    deletePayee,
    addSubscription,
    updateSubscriptionStatus,
    processPayrollRun,
  }
}
