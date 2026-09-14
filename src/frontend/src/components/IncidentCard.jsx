import React from 'react';
import { 
  MapPin, 
  Users, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Droplets, 
  Construction, 
  Zap, 
  Activity 
} from 'lucide-react';

export default function IncidentCard({ 
  incident, 
  rank, 
  isSelected, 
  onSelect 
}) {
  const urgency = incident.urgency.toUpperCase();

  const getUrgencyBadgeClass = (urg) => {
    switch (urg) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const getCategoryIcon = (cat, type) => {
    if (type.includes('Flood')) return <Droplets size={14} color="#38bdf8" />;
    if (type.includes('Fire')) return <Flame size={14} color="#f97316" />;
    if (type.includes('Power') || type.includes('Electrical')) return <Zap size={14} color="#eab308" />;
    if (type.includes('Collapse') || type.includes('Road') || type.includes('Bridge')) return <Construction size={14} color="#fb923c" />;
    return <Activity size={14} color="#94a3b8" />;
  };

  return (
    <div
      onClick={() => onSelect(incident)}
      style={{
        padding: '1rem',
        borderRadius: '10px',
        background: isSelected 
          ? 'rgba(30, 58, 138, 0.45)' 
          : 'rgba(18, 26, 47, 0.85)',
        border: isSelected 
          ? '1.5px solid #38bdf8' 
          : '1px solid rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.25)' : 'none',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'rgba(26, 38, 68, 0.95)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'rgba(18, 26, 47, 0.85)';
      }}
    >
      {/* Top row: Rank, Urgency, Priority Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#64748b',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px'
          }}>
            #{rank}
          </span>
          <span 
            className={getUrgencyBadgeClass(urgency)}
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: '9999px',
              letterSpacing: '0.04em'
            }}
          >
            {urgency === 'CRITICAL' && '🔴 '}
            {urgency === 'HIGH' && '🟠 '}
            {urgency === 'MEDIUM' && '🟡 '}
            {urgency === 'LOW' && '🟢 '}
            {urgency}
          </span>
        </div>

        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#38bdf8',
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          Priority: {Math.round(incident.priority_score)}
        </div>
      </div>

      {/* Incident Title */}
      <h3 style={{
        fontSize: '0.98rem',
        fontWeight: 700,
        color: '#f8fafc',
        lineHeight: 1.35,
        marginBottom: '0.4rem'
      }}>
        {incident.title}
      </h3>

      {/* Location */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: '0.65rem'
      }}>
        <MapPin size={13} color="#38bdf8" />
        <span>{incident.location}</span>
      </div>

      {/* Footer Metrics */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        fontSize: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#7dd3fc',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            fontWeight: 700
          }}>
            {incident.report_count} {incident.report_count === 1 ? 'report' : 'reports'}
          </span>

          {incident.people_at_risk && (
            <span style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#fca5a5',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <Users size={11} /> Trapped / At Risk
            </span>
          )}
        </div>

        <div style={{
          color: incident.status === 'Active' ? '#f59e0b' : (incident.status === 'In Progress' ? '#38bdf8' : '#10b981'),
          fontWeight: 600
        }}>
          {incident.status}
        </div>
      </div>
    </div>
  );
}
