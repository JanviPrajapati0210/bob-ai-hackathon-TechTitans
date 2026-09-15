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
  LifeBuoy,
  Copy
} from 'lucide-react';
import { updateIncidentStatus } from '../services/api';

export default function IncidentDetail({ incident, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [showReports, setShowReports] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!incident) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px dashed var(--border-color)',
        boxShadow: 'var(--card-shadow)'
      }}>
        <LifeBuoy size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>No Incident Selected</h3>
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

  const handleCopyBrief = () => {
    const brief = `[CRISIS-AI DISPATCH BRIEFING]\nIncident #${incident.id}: ${incident.title}\nSeverity: ${incident.urgency} | Status: ${incident.status} | Priority Score: ${Math.round(incident.priority_score)}\nLocation: ${incident.location}\nReports Linked: ${incident.report_count} | Trapped/At Risk: ${incident.people_at_risk ? 'YES' : 'No'}\nRecommended Action: ${incident.recommended_action || 'Deploy field assessment unit.'}`;
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const urgency = incident.urgency.toUpperCase();

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      padding: '1.25rem',
      boxShadow: 'var(--card-shadow)'
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
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--ibm-cyan)',
              background: 'rgba(56, 189, 248, 0.15)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px'
            }}>
              INCIDENT #{incident.id}
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: urgency === 'CRITICAL' ? '#ef4444' : (urgency === 'HIGH' ? '#f97316' : (urgency === 'MEDIUM' ? '#eab308' : '#10b981')),
              background: urgency === 'CRITICAL' ? 'var(--critical-bg)' : (urgency === 'HIGH' ? 'var(--high-bg)' : 'var(--bg-tag)'),
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)'
            }}>
              {urgency}
            </span>

            {/* Quick Copy Briefing Button */}
            <button
              onClick={handleCopyBrief}
              title="Copy Dispatch Brief to Clipboard"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              {copied ? 'Copied Brief' : 'Copy Brief'}
            </button>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            {incident.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={13} color="var(--ibm-cyan)" /> {incident.location}
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
                  ? '1px solid var(--ibm-cyan)' 
                  : '1px solid var(--border-color)',
                background: incident.status === st 
                  ? 'rgba(56, 189, 248, 0.2)' 
                  : 'var(--bg-input)',
                color: incident.status === st ? 'var(--ibm-cyan)' : 'var(--text-muted)'
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
        <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REPORTS</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ibm-cyan)', marginTop: '0.2rem' }}>
            {incident.report_count} reports
          </div>
        </div>

        <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>PEOPLE AT RISK</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: incident.people_at_risk ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
            {incident.people_at_risk ? 'YES (Trapped)' : 'No Immediate Risk'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI PRIORITY SCORE</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.2rem' }}>
            {Math.round(incident.priority_score)} pts
          </div>
        </div>
      </div>

      {/* Recommended Action Callout */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 98, 254, 0.12) 0%, rgba(138, 63, 252, 0.12) 100%)',
        border: '1px solid var(--border-accent)',
        borderRadius: '8px',
        padding: '0.85rem 1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--ibm-cyan)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <ShieldCheck size={16} /> Recommended Emergency Action
        </div>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.35rem', lineHeight: 1.4 }}>
          {incident.recommended_action || "Deploy field assessment unit to verify and cordon scene."}
        </p>
      </div>

      {/* AI Evidence Box */}
      <div style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '0.85rem 1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a855f7', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          <Sparkles size={15} /> AI Evidence & Deduplication Corroboration
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {incident.ai_evidence && incident.ai_evidence.length > 0 ? (
            incident.ai_evidence.map((ev, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />
                <span>{ev}</span>
              </li>
            ))
          ) : (
            <li style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
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
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <FileText size={14} color="var(--ibm-cyan)" />
            <span>Merged Citizen & Field Reports ({incident.reports ? incident.reports.length : incident.report_count})</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--ibm-cyan)' }}>
            {showReports ? 'Collapse' : 'Expand'}
          </span>
        </div>

        {showReports && incident.reports && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem', maxHeight: '240px', overflowY: 'auto' }}>
            {incident.reports.map((rep) => (
              <div 
                key={rep.id} 
                style={{
                  background: 'var(--bg-input)',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.3rem' }}>
                  <span>Report #{rep.id} • {rep.source || 'Citizen'}</span>
                  <span>{rep.reporter}</span>
                </div>
                <p style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
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
