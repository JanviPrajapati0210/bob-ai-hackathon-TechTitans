import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Users, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowDownRight,
  Database
} from 'lucide-react';

export default function AnalyticsView({ stats, incidents }) {
  const totalReports = stats.total_reports || 0;
  const totalIncidents = stats.total_incidents || 0;
  
  // Calculate deduplication noise reduction
  const noiseReduced = totalReports > 0 && totalIncidents > 0 
    ? Math.max(0, Math.round(((totalReports - totalIncidents) / totalReports) * 100))
    : 0;

  // Category counts
  const categoryMap = {};
  incidents.forEach(inc => {
    const cat = inc.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const categories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const trappedCount = incidents.filter(i => i.people_at_risk).length;
  const totalPeopleCount = incidents.reduce((sum, i) => sum + (i.people_count || 0), 0);

  const urgencyData = [
    { label: 'Critical', count: stats.critical_count || 0, color: '#ef4444', bg: 'var(--critical-bg)' },
    { label: 'High', count: stats.high_count || 0, color: '#f97316', bg: 'var(--high-bg)' },
    { label: 'Medium', count: stats.medium_count || 0, color: '#eab308', bg: 'var(--medium-bg)' },
    { label: 'Low', count: stats.low_count || 0, color: '#10b981', bg: 'var(--low-bg)' },
  ];

  return (
    <div style={{
      maxWidth: '1600px',
      width: '100%',
      margin: '0 auto',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Analytics Header */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.25rem 1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0f62fe 0%, #8a3ffc 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Emergency Intelligence & AI Pipeline Analytics
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time deduplication efficiency, triage distribution, and Watsonx Granite clustering statistics
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-input)',
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <Cpu size={14} color="#a855f7" />
          <span>Watsonx Granite NLP: <strong>Active (24ms Latency)</strong></span>
        </div>
      </div>

      {/* Top 4 Key Efficiency Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {/* Deduplication Efficiency Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Deduplication Rate
            </span>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <ArrowDownRight size={14} /> {noiseReduced}% Clutter Cut
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>
            {noiseReduced}%
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {totalReports} incoming raw reports distilled into <strong>{totalIncidents}</strong> actionable clusters.
          </p>
        </div>

        {/* High Risk / Trapped Alert Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Trapped / Life Risk
            </span>
            <div style={{ background: 'var(--critical-bg)', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              {trappedCount} Priority Zones
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '0.5rem' }}>
            {trappedCount}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Estimated <strong>{totalPeopleCount}</strong> people needing active rescue assistance.
          </p>
        </div>

        {/* Critical & High Incident Load */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Severe Dispatches
            </span>
            <div style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              Critical + High
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f97316', marginTop: '0.5rem' }}>
            {(stats.critical_count || 0) + (stats.high_count || 0)}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Accounting for <strong>{totalIncidents > 0 ? Math.round((((stats.critical_count || 0) + (stats.high_count || 0)) / totalIncidents) * 100) : 0}%</strong> of active operational volume.
          </p>
        </div>

        {/* Resolution Rate */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Dispatch Status
            </span>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--ibm-cyan)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
              {stats.active_count || 0} Active
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ibm-cyan)', marginTop: '0.5rem' }}>
            {stats.in_progress_count || 0} / {stats.resolved_count || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <strong>{stats.in_progress_count || 0}</strong> teams dispatched, <strong>{stats.resolved_count || 0}</strong> incidents closed.
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Urgency Severity Distribution */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Incident Severity Breakdown
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Watsonx Granite Ranked</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {urgencyData.map((urg) => {
              const pct = totalIncidents > 0 ? Math.round((urg.count / totalIncidents) * 100) : 0;
              return (
                <div key={urg.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: urg.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: urg.color }}></span>
                      {urg.label}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {urg.count} incidents ({pct}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--bg-input)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: urg.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Category & Domain Distribution
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Semantic Clustered</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categories.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                No active category data available.
              </p>
            ) : (
              categories.map(([catName, count]) => {
                const pct = totalIncidents > 0 ? Math.round((count / totalIncidents) * 100) : 0;
                return (
                  <div key={catName}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {catName}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '7px',
                      background: 'var(--bg-input)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #0f62fe 0%, #8a3ffc 100%)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* AI Pipeline Architecture Callout */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        padding: '1.25rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(15, 98, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f62fe',
            flexShrink: 0
          }}>
            <Database size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              1. Multi-Channel Ingestion
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Standardizes raw SOS SMS, Citizen App, Helpline, and Radio dispatches into structured JSON payloads.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(138, 63, 252, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8a3ffc',
            flexShrink: 0
          }}>
            <Cpu size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              2. Watsonx Granite NLP Extraction
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Extracts emergency type, geo-location, danger keywords, life-safety risk flags, and urgency tiers.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ibm-cyan)',
            flexShrink: 0
          }}>
            <Zap size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              3. TF-IDF & Cosine Deduplication
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Calculates semantic N-gram similarity threshold (0.65+) to fuse duplicate reports into single verified incidents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
