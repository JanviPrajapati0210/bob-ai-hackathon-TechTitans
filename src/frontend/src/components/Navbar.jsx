import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Play, 
  PlusCircle, 
  RotateCcw, 
  Trash2,
  Cpu
} from 'lucide-react';

export default function Navbar({ 
  stats, 
  onRunDemo, 
  onOpenSubmit, 
  onRefresh, 
  onReset, 
  isSeeding 
}) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0f62fe 0%, #8a3ffc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(15, 98, 254, 0.5)'
          }}>
            <ShieldAlert size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                CRISIS<span style={{ color: '#38bdf8' }}>AI</span>
              </h1>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                background: 'rgba(15, 98, 254, 0.2)',
                color: '#60a5fa',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                border: '1px solid rgba(15, 98, 254, 0.4)',
                letterSpacing: '0.05em'
              }}>
                IBM BOB COMMAND CENTER
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
              <Cpu size={12} color="#a855f7" />
              <span>watsonx Granite & NLP Cluster Engine Active</span>
            </p>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: 'rgba(17, 24, 39, 0.7)',
          padding: '0.35rem 0.65rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div className="badge-critical" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            Critical: {stats.critical_count}
          </div>
          <div className="badge-high" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }}></span>
            High: {stats.high_count}
          </div>
          <div className="badge-medium" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }}></span>
            Medium: {stats.medium_count}
          </div>
          <div className="badge-low" style={{ padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Low: {stats.low_count}
          </div>

          <div style={{ height: '16px', width: '1px', background: 'rgba(255, 255, 255, 0.15)', margin: '0 0.25rem' }}></div>

          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
            Reports: <span style={{ color: '#38bdf8' }}>{stats.total_reports}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>
            Incidents: <span style={{ color: '#a855f7' }}>{stats.total_incidents}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={onRunDemo}
            disabled={isSeeding}
            style={{
              background: 'linear-gradient(135deg, #0f62fe 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(15, 98, 254, 0.35)',
              opacity: isSeeding ? 0.7 : 1
            }}
          >
            <Play size={15} fill="#ffffff" />
            {isSeeding ? 'Processing 50 Reports...' : 'Run 50-Report Demo'}
          </button>

          <button
            onClick={onOpenSubmit}
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              padding: '0.55rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <PlusCircle size={15} />
            Submit Report
          </button>

          <button
            onClick={onRefresh}
            title="Refresh feed"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.55rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={onReset}
            title="Reset Database"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              padding: '0.55rem',
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
    </header>
  );
}
