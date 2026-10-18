import { useEffect, useState, useCallback } from "react"
import {
  subscribeToDashboard,
  ensureDashboardSeeded,
  getBaselineDashboardData,
  createDashboardProject,
  createDashboardObligation,
  createDashboardEvent,
  logDashboardActivity,
  type DashboardData,
  type DbProject,
  type DbObligation,
  type DbEvent,
  type DbActivity,
} from "@/lib/admin/dashboardService"

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(() => getBaselineDashboardData())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    let active = true

    // Set up real-time listener with Firestore
    const unsubscribe = subscribeToDashboard(
      (freshData) => {
        if (!active) return
        setData(freshData)
        setLoading(false)
        setError(null)
        setIsLive(true)
      },
      (err) => {
        if (!active) return
        console.error("Firestore dashboard subscription error:", err)
        setError("Failed to connect to real-time database. Showing cached/fallback data.")
        setLoading(false)
        setIsLive(false)
      }
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const addProject = useCallback(async (project: Omit<DbProject, "id">) => {
    try {
      await createDashboardProject(project)
    } catch (err: any) {
      console.error("Failed to add project to Firestore:", err)
      throw err
    }
  }, [])

  const addObligation = useCallback(async (obligation: Omit<DbObligation, "id">) => {
    try {
      await createDashboardObligation(obligation)
    } catch (err: any) {
      console.error("Failed to add obligation to Firestore:", err)
      throw err
    }
  }, [])

  const addEvent = useCallback(async (event: Omit<DbEvent, "id">) => {
    try {
      await createDashboardEvent(event)
    } catch (err: any) {
      console.error("Failed to add event to Firestore:", err)
      throw err
    }
  }, [])

  const addActivity = useCallback(async (activity: DbActivity) => {
    try {
      await logDashboardActivity(activity)
    } catch (err: any) {
      console.error("Failed to record activity in Firestore:", err)
      throw err
    }
  }, [])

  const resetToBaseline = useCallback(async () => {
    setLoading(true)
    try {
      await ensureDashboardSeeded(true)
    } catch (err: any) {
      console.error("Failed to reset baseline in Firestore:", err)
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
    addProject,
    addObligation,
    addEvent,
    addActivity,
    resetToBaseline,
  }
}
