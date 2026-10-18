import { useEffect, useState, useCallback } from "react"
import {
  subscribeToBudgetRevenue,
  getBRBaseline,
  updateBudgetCap as firestoreUpdateBudgetCap,
  ensureBudgetTargetsSeeded,
  type BudgetRevenueData,
} from "@/lib/admin/budgetRevenueService"

export function useBudgetRevenueData() {
  const [data, setData] = useState<BudgetRevenueData>(() => getBRBaseline())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    let active = true

    const unsubscribe = subscribeToBudgetRevenue(
      (freshData) => {
        if (!active) return
        setData(freshData)
        setLoading(false)
        setError(null)
        setIsLive(true)
      },
      (err) => {
        if (!active) return
        console.error("Firestore budget-revenue subscription error:", err)
        setError("Failed to connect to real-time database. Showing cached financial data.")
        setLoading(false)
        setIsLive(false)
      }
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const updateBudgetCap = useCallback(async (newCap: number) => {
    try {
      await firestoreUpdateBudgetCap(newCap)
    } catch (err: any) {
      console.error("Failed to update budget cap in Firestore:", err)
      throw err
    }
  }, [])

  const reseedBaseline = useCallback(async () => {
    setLoading(true)
    try {
      await ensureBudgetTargetsSeeded()
    } catch (err: any) {
      console.error("Failed to reseed budget targets:", err)
      setError("Failed to reseed database.")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    isLive,
    updateBudgetCap,
    reseedBaseline,
  }
}
