import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DemoControlBar from './components/DemoControlBar';
import IncidentCard from './components/IncidentCard';
import IncidentMap from './components/IncidentMap';
import IncidentDetail from './components/IncidentDetail';
import ReportSubmitModal from './components/ReportSubmitModal';
import { 
  fetchStats, 
  fetchIncidents, 
  seedDemoData, 
  resetDatabase,
  fetchIncidentDetail
} from './services/api';
import { AlertTriangle, Sparkles, Shield, RefreshCw } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState({
    total_reports: 0,
    total_incidents: 0,
    critical_count: 0,
    high_count: 0,
    medium_count: 0,
    low_count: 0,
    active_count: 0,
    in_progress_count: 0,
    resolved_count: 0
  });

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, incidentsData] = await Promise.all([
        fetchStats(),
        fetchIncidents({
          urgency: selectedUrgency,
          category: selectedCategory
        })
      ]);
      setStats(statsData);
      setIncidents(incidentsData);

      // Auto-select first incident if none selected
      if (incidentsData.length > 0) {
        if (!selectedIncident || !incidentsData.find(i => i.id === selectedIncident.id)) {
          // Fetch full detail with reports
          const detail = await fetchIncidentDetail(incidentsData[0].id);
          setSelectedIncident(detail);
        } else {
          const detail = await fetchIncidentDetail(selectedIncident.id);
          setSelectedIncident(detail);
        }
      } else {
        setSelectedIncident(null);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedUrgency, selectedCategory]);

  const handleSelectIncident = async (incident) => {
    try {
      const detail = await fetchIncidentDetail(incident.id);
      setSelectedIncident(detail);
    } catch (err) {
      console.error('Failed to load detail:', err);
      setSelectedIncident(incident);
    }
  };

  const handleRunDemo = async () => {
    try {
      setIsSeeding(true);
      setNotification({
        type: 'info',
        text: 'AI Pipeline executing: Processing 50 incoming emergency reports and clustering...'
      });

      const res = await seedDemoData();
      await loadData();

      // Find the Railway Station flood (Incident #1) to showcase
      const allIncidents = await fetchIncidents();
      const railwayFlood = allIncidents.find(i => i.location.includes('Railway Station') && i.incident_type.includes('Flood')) || allIncidents[0];
      if (railwayFlood) {
        const detail = await fetchIncidentDetail(railwayFlood.id);
        setSelectedIncident(detail);
      }

      setNotification({
        type: 'success',
        text: `Demo completed! ${res.total_reports_processed} reports processed into ${res.total_unique_incidents} unique incidents. (🔴 ${res.breakdown.critical} Critical, 🟠 ${res.breakdown.high} High, 🟡 ${res.breakdown.medium} Medium, 🟢 ${res.breakdown.low} Low)`
      });

      setTimeout(() => setNotification(null), 8000);
    } catch (err) {
      setNotification({
        type: 'error',
        text: 'Failed to run demo pipeline: ' + err.message
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all reports and incidents in database?')) return;
    try {
      await resetDatabase();
      setSelectedIncident(null);
      await loadData();
      setNotification({ type: 'info', text: 'Database cleared. Ready for fresh report ingestion.' });
      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredIncidents = incidents.filter(i => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.incident_type.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0f1d' }}>
      {/* Top Navbar */}
      <Navbar
        stats={stats}
        onRunDemo={handleRunDemo}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onRefresh={loadData}
        onReset={handleReset}
        isSeeding={isSeeding}
      />

      {/* Filter and Search Bar */}
      <DemoControlBar
        selectedUrgency={selectedUrgency}
        onSelectUrgency={setSelectedUrgency}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        incidentsCount={filteredIncidents.length}
      />

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: notification.type === 'success' 
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 98, 254, 0.2) 100%)' 
            : (notification.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)'),
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0.65rem 1.5rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} color="#38bdf8" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 1.15fr) minmax(420px, 1.35fr)',
        gap: '1.25rem',
        padding: '1.25rem 1.5rem',
        maxWidth: '1800px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        {/* Left Column: Priority Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: 'calc(100vh - 165px)', overflowY: 'auto', paddingRight: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PRIORITIZED INCIDENT DISPATCH FEED
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Ranked by AI Severity & Multi-Source Volume
            </span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div style={{
              background: 'rgba(18, 26, 47, 0.6)',
              borderRadius: '12px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <AlertTriangle size={32} color="#f59e0b" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 600, color: '#cbd5e1' }}>No incidents match your filter.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Click <strong>"Run 50-Report Demo"</strong> above to test the multi-source emergency pipeline.
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident, idx) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                rank={idx + 1}
                isSelected={selectedIncident && selectedIncident.id === incident.id}
                onSelect={handleSelectIncident}
              />
            ))
          )}
        </div>

        {/* Right Column: Tactical Map + Incident Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 165px)', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {/* Tactical Geo-Grid Map */}
          <IncidentMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={handleSelectIncident}
          />

          {/* Detailed Incident View with AI Evidence & Recommended Action */}
          <IncidentDetail
            incident={selectedIncident}
            onStatusChange={(updated) => {
              setSelectedIncident(updated);
              loadData();
            }}
          />
        </div>
      </div>

      {/* Citizen Report Modal */}
      <ReportSubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onReportSubmitted={() => {
          loadData();
        }}
      />
    </div>
  );
}
