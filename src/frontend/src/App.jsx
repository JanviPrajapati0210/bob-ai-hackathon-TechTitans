import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import DemoControlBar from './components/DemoControlBar';
import IncidentCard from './components/IncidentCard';
import IncidentMap from './components/IncidentMap';
import IncidentDetail from './components/IncidentDetail';
import ReportSubmitModal from './components/ReportSubmitModal';
import ReportsStreamView from './components/ReportsStreamView';
import AnalyticsView from './components/AnalyticsView';
import AiSandboxView from './components/AiSandboxView';
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
  
  // Page / Tab state: 'command_center' | 'reports_stream' | 'analytics' | 'ai_sandbox'
  const [activeTab, setActiveTab] = useState('command_center');

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('crisisai_theme') || 'dark';
  });

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('crisisai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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

  // Auto-refresh interval
  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        loadData();
      }, 12000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, selectedUrgency, selectedCategory]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search on '/' key press if not typing in an input
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setActiveTab('command_center');
        const searchInput = document.getElementById('command-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectIncident = async (incident) => {
    try {
      const detail = await fetchIncidentDetail(incident.id);
      setSelectedIncident(detail);
    } catch (err) {
      console.error('Failed to load detail:', err);
      setSelectedIncident(incident);
    }
  };

  const handleSelectIncidentById = async (incidentId) => {
    setActiveTab('command_center');
    try {
      const detail = await fetchIncidentDetail(incidentId);
      setSelectedIncident(detail);
    } catch (err) {
      console.error('Failed to load incident detail by ID:', err);
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

  const handleExportData = () => {
    const exportPayload = {
      exported_at: new Date().toISOString(),
      summary_stats: stats,
      incidents: incidents
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `crisis_ai_dispatch_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setNotification({
      type: 'info',
      text: 'Incident intelligence summary exported successfully.'
    });
    setTimeout(() => setNotification(null), 3000);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <Navbar
        stats={stats}
        onRunDemo={handleRunDemo}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onRefresh={loadData}
        onReset={handleReset}
        isSeeding={isSeeding}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
        onExportData={handleExportData}
      />

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: notification.type === 'success' 
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 98, 254, 0.2) 100%)' 
            : (notification.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.2)'),
          borderBottom: '1px solid var(--border-color)',
          padding: '0.65rem 1.5rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} color="var(--ibm-cyan)" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* PAGE 1: Operational Command Center */}
      {activeTab === 'command_center' && (
        <>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: 'calc(100vh - 195px)', overflowY: 'auto', paddingRight: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.25rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PRIORITIZED INCIDENT DISPATCH FEED
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ranked by AI Severity & Multi-Source Volume
                </span>
              </div>

              {filteredIncidents.length === 0 ? (
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-color)',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <AlertTriangle size={32} color="#f59e0b" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No incidents match your filter.</p>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 195px)', overflowY: 'auto', paddingRight: '0.25rem' }}>
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
        </>
      )}

      {/* PAGE 2: Raw Ingested Reports Stream */}
      {activeTab === 'reports_stream' && (
        <ReportsStreamView onSelectIncidentById={handleSelectIncidentById} />
      )}

      {/* PAGE 3: Analytics & Model Metrics */}
      {activeTab === 'analytics' && (
        <AnalyticsView stats={stats} incidents={incidents} />
      )}

      {/* PAGE 4: AI Sandbox & Classification Playground */}
      {activeTab === 'ai_sandbox' && (
        <AiSandboxView onReportSubmitted={loadData} />
      )}

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
