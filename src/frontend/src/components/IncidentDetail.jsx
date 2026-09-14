import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles, 
  Layers, 
  Radio, 
  FileText, 
  Check, 
  ChevronRight,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { updateIncidentStatus } from '../services/api';

export default function IncidentDetail({ incident, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [showReports, setShowReports] = useState(true);

  if (!incident) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        color: '#64748b',
        background: 'rgba(18, 26, 47, 0.5)',
        borderRadius: '12px',
        border: '1px dashed rgba(255, 255, 255, 0.1)'
      }}>
        <LifeBuoy size={36} color="#475569" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>No Incident Selected</h3>
        <p style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
          Select an incident card or map pin to inspect AI evidence, deduplication history, and recommended response.
        </p>
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const updated = await updateIncidentStatus(incident.id, newStatus);
      onStatusChange(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const urgency = incident.urgency.toUpperCase();

  return (
    <div style={{
      background: 'rgba(18, 26, 47, 0.95)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1.25rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Top Header: Incident Title & Status Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.15)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px'
            }}>
              INCIDENT #{incident.id}
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: urgency === 'CRITICAL' ? '#fca5a5' : (urgency === 'HIGH' ? '#fdba74' : (urgency === 'MEDIUM' ? '#fef08a' : '#86efac')),
              background: urgency === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {urgency}
            </span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.25 }}>
            {incident.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={13} color="#38bdf8" /> {incident.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Layers size={13} color="#a855f7" /> {incident.category}
            </span>
          </div>
        </div>

        {/* Operational Status Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {['Active', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              disabled={updating || incident.status === st}
              onClick={() => handleStatusChange(st)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: incident.status === st 
                  ? '1px solid #38bdf8' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                background: incident.status === st 
                  ? 'rgba(56, 189, 248, 0.2)' 
                  : 'rgba(30, 41, 59, 0.6)',
                color: incident.status === st ? '#38bdf8' : '#94a3b8'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.65rem',
        marginBottom: '1rem'
      }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>TOTAL REPORTS</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
            {incident.report_count} reports
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>PEOPLE AT RISK</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: incident.people_at_risk ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
            {incident.people_at_risk ? 'YES (Trapped)' : 'No Immediate Risk'}
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.65rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>AI PRIORITY SCORE</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
            {Math.round(incident.priority_score)} pts
          </div>
        </div>
      </div>

      {/* Recommended Action Callout */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 98, 254, 0.15) 0%, rgba(138, 63, 252, 0.15) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '8px',
        padding: '0.85rem 1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <ShieldCheck size={16} /> Recommended Emergency Action
        </div>
        <p style={{ color: '#f1f5f9', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.35rem', lineHeight: 1.4 }}>
          {incident.recommended_action || "Deploy field assessment unit to verify and cordon scene."}
        </p>
      </div>

      {/* AI Evidence Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '8px',
        padding: '0.85rem 1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#c084fc', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          <Sparkles size={15} /> AI Evidence & Deduplication Corroboration
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {incident.ai_evidence && incident.ai_evidence.length > 0 ? (
            incident.ai_evidence.map((ev, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />
                <span>{ev}</span>
              </li>
            ))
          ) : (
            <li style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              • {incident.report_count} report analyzed by NLP cluster engine.
            </li>
          )}
        </ul>
      </div>

      {/* Merged Reports List */}
      <div>
        <div 
          onClick={() => setShowReports(!showReports)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '0.4rem 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
            <FileText size={14} color="#38bdf8" />
            <span>Merged Citizen & Field Reports ({incident.reports ? incident.reports.length : incident.report_count})</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
            {showReports ? 'Collapse' : 'Expand'}
          </span>
        </div>

        {showReports && incident.reports && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem', maxHeight: '240px', overflowY: 'auto' }}>
            {incident.reports.map((rep) => (
              <div 
                key={rep.id} 
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                  <span>Report #{rep.id} • {rep.source || 'Citizen'}</span>
                  <span>{rep.reporter}</span>
                </div>
                <p style={{ color: '#e2e8f0', lineHeight: 1.4 }}>
                  "{rep.text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
