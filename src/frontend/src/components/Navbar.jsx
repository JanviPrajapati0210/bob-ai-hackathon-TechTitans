import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Play, 
  PlusCircle, 
  RotateCcw, 
  Trash2,
  Cpu,
  LayoutDashboard,
  Radio,
  BarChart3,
  Sun,
  Moon,
  Download,
  Timer
} from 'lucide-react';

export default function Navbar({ 
  stats, 
  onRunDemo, 
  onOpenSubmit, 
  onRefresh, 
  onReset, 
  isSeeding,
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
  autoRefresh,
  onToggleAutoRefresh,
  onExportData
}) {
  const navTabs = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'reports_stream', label: 'Live Stream', icon: Radio, count: stats.total_reports },
    { id: 'analytics', label: 'Analytics & AI', icon: BarChart3 },
    { id: 'ai_sandbox', label: 'AI Sandbox', icon: Cpu },
  ];

  return (
    <header style={{
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--card-shadow)'
    }}>
      {/* Top Bar: Brand, Live Counters & Main Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        {/* Brand & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0f62fe 0%, #8a3ffc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(15, 98, 254, 0.4)'
          }}>
            <ShieldAlert size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                CRISIS<span style={{ color: 'var(--ibm-cyan)' }}>AI</span>
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'rgba(15, 98, 254, 0.15)',
                color: 'var(--ibm-blue)',
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                border: '1px solid var(--border-accent)',
                letterSpacing: '0.05em'
              }}>
                IBM BOB COMMAND CENTER
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1px' }}>
              <Cpu size={12} color="#a855f7" />
              <span>watsonx Granite & NLP Cluster Engine Active</span>
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          flexWrap: 'wrap',
          background: 'var(--bg-tag)',
          padding: '0.3rem 0.6rem',
          borderRadius: '10px',
          border: '1px solid var(--border-color)'
        }}>
          <div className="badge-critical" style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            Critical: {stats.critical_count}
          </div>
          <div className="badge-high" style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }}></span>
            High: {stats.high_count}
          </div>
          <div className="badge-medium" style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }}></span>
            Medium: {stats.medium_count}
          </div>
          <div className="badge-low" style={{ padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Low: {stats.low_count}
          </div>

          <div style={{ height: '14px', width: '1px', background: 'var(--border-color)', margin: '0 0.15rem' }}></div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Reports: <span style={{ color: 'var(--ibm-cyan)' }}>{stats.total_reports}</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Incidents: <span style={{ color: '#a855f7' }}>{stats.total_incidents}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={onRunDemo}
            disabled={isSeeding}
            style={{
              background: 'linear-gradient(135deg, #0f62fe 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(15, 98, 254, 0.35)',
              opacity: isSeeding ? 0.7 : 1
            }}
          >
            <Play size={14} fill="#ffffff" />
            {isSeeding ? 'Processing 50 Reports...' : 'Run 50-Report Demo'}
          </button>

          <button
            onClick={onOpenSubmit}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--ibm-cyan)',
              border: '1px solid var(--border-accent)',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <PlusCircle size={14} />
            Submit Report
          </button>

          {/* Auto Refresh Toggle */}
          <button
            onClick={onToggleAutoRefresh}
            title={autoRefresh ? 'Auto-refresh active (12s)' : 'Auto-refresh paused'}
            style={{
              background: autoRefresh ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-input)',
              color: autoRefresh ? '#10b981' : 'var(--text-muted)',
              border: autoRefresh ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
              padding: '0.5rem 0.65rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            <Timer size={14} />
            <span>{autoRefresh ? 'Live' : 'Paused'}</span>
          </button>

          {/* Export Data Button */}
          <button
            onClick={onExportData}
            title="Export Incidents Summary (JSON)"
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Download size={15} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              background: 'var(--bg-input)',
              color: theme === 'dark' ? '#f59e0b' : '#0f62fe',
              border: '1px solid var(--border-color)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Refresh Feed */}
          <button
            onClick={onRefresh}
            title="Refresh feed"
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={15} />
          </button>

          {/* Reset Database */}
          <button
            onClick={onReset}
            title="Reset Database"
            style={{
              background: 'var(--bg-input)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Navigation Subheader / Multi-Page Tab Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        marginTop: '0.65rem',
        paddingTop: '0.65rem',
        borderTop: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                background: isActive ? 'rgba(15, 98, 254, 0.15)' : 'transparent',
                color: isActive ? 'var(--ibm-blue)' : 'var(--text-muted)',
                border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={14} color={isActive ? 'var(--ibm-blue)' : 'currentColor'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.05rem 0.35rem',
                  borderRadius: '9999px',
                  background: isActive ? 'var(--ibm-blue)' : 'var(--bg-tag)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
