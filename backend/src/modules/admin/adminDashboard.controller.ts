import type { Request, Response } from 'express';
import { db } from '../../config/firebase.js';
import { ok } from '../../lib/response.js';

export async function adminGetDashboardMetrics(_req: Request, res: Response) {
  const [finSnap, projsSnap, empsSnap, obsSnap, actsSnap, evtsSnap] = await Promise.all([
    db.collection('dashboard_financials').doc('current').get(),
    db.collection('dashboard_projects').get(),
    db.collection('dashboard_employees').get(),
    db.collection('dashboard_obligations').get(),
    db.collection('dashboard_activities').orderBy('timestamp', 'desc').limit(10).get(),
    db.collection('dashboard_events').get(),
  ]);

  const financials = finSnap.exists ? finSnap.data() : null;
  const projects = projsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const employees = empsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const obligations = obsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const activities = actsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const events = evtsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  ok(res, {
    financials,
    projects,
    employees,
    obligations,
    activities,
    events,
  });
}
