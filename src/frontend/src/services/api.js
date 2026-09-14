const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchIncidents(params = {}) {
  const query = new URLSearchParams();
  if (params.urgency) query.append('urgency', params.urgency);
  if (params.category) query.append('category', params.category);
  if (params.status) query.append('status', params.status);

  const res = await fetch(`${API_BASE}/incidents?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function fetchIncidentDetail(id) {
  const res = await fetch(`${API_BASE}/incidents/${id}`);
  if (!res.ok) throw new Error('Failed to fetch incident detail');
  return res.json();
}

export async function updateIncidentStatus(id, newStatus) {
  const res = await fetch(`${API_BASE}/incidents/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) throw new Error('Failed to update incident status');
  return res.json();
}

export async function submitReport(reportData) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  if (!res.ok) throw new Error('Failed to submit report');
  return res.json();
}

export async function analyzeReport(text) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to analyze text');
  return res.json();
}

export async function seedDemoData() {
  const res = await fetch(`${API_BASE}/demo/seed`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to seed demo data');
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/demo/reset`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset database');
  return res.json();
}
