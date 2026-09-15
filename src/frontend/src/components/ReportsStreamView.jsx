import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  Smartphone, 
  MessageSquare, 
  PhoneCall, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { fetchReports } from '../services/api';

export default function ReportsStreamView({ onSelectIncidentById }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch reports stream:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const getSourceIcon = (source) => {
    if (source.includes('SMS')) return <MessageSquare size={14} color="#38bdf8" />;
    if (source.includes('Helpline') || source.includes('Phone')) return <PhoneCall size={14} color="#f59e0b" />;
    if (source.includes('Radio')) return <Radio size={14} color="#a855f7" />;
    return <Smartphone size={14} color="#10b981" />;
  };

  const getUrgencyBadgeClass = (urg) => {
    switch (urg ? urg.toUpperCase() : '') {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const filteredReports = reports.filter(rep => {
    if (selectedChannel && rep.source !== selectedChannel) return false;
    if (selectedUrgency && rep.urgency?.toUpperCase() !== selectedUrgency.toUpperCase()) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (rep.text && rep.text.toLowerCase().includes(q)) ||
      (rep.location && rep.location.toLowerCase().includes(q)) ||
      (rep.reporter && rep.reporter.toLowerCase().includes(q)) ||
      (rep.incident_type && rep.incident_type.toLowerCase().includes(q))
    );
  });

  const channels = ['All Channels', 'Citizen Mobile App', 'Citizen SMS', 'Emergency Helpline', 'Field Radio', 'Public Utilities', 'Web Submission'];

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
      {/* Stream Control Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ibm-cyan)'
          }}>
            <Radio size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Live Emergency Ingestion Stream
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Chronological feed of raw multi-channel citizen dispatches analyzed by Watsonx NLP
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search reports or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Channel Dropdown */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value === 'All Channels' ? '' : e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            {channels.map(ch => (
              <option key={ch} value={ch === 'All Channels' ? '' : ch}>{ch}</option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            <option value="">All Urgencies</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🟢 Low</option>
          </select>

          <button
            onClick={loadReports}
            title="Refresh stream"
            style={{
              padding: '0.45rem 0.75rem',
              background: 'var(--bg-tag)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600
            }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Reports Summary Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem'
      }}>
        <div style={{ background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL STREAM REPORTS</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ibm-cyan)', marginTop: '0.2rem' }}>
            {reports.length}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>FILTERED MATCHES</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a855f7', marginTop: '0.2rem' }}>
            {filteredReports.length}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>HIGH RISK / TRAPPED</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ef4444', marginTop: '0.2rem' }}>
            {reports.filter(r => r.people_at_risk).length}
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AI NLP EXTRACTION RATE</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
            100%
          </div>
        </div>
      </div>

      {/* Reports Table / Stream Feed */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow)'
      }}>
        {filteredReports.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertTriangle size={36} color="#f59e0b" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No reports match your current filter.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Run the 50-Report Demo from the top header or submit a report to populate the stream.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1.4fr 1fr 140px 140px 110px',
              padding: '0.75rem 1.25rem',
              background: 'var(--bg-controlbar)',
              borderBottom: '1px solid var(--border-color)',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <div>ID</div>
              <div>Report Text & Content</div>
              <div>AI Extracted Entities</div>
              <div>Source & Reporter</div>
              <div>Urgency</div>
              <div>Cluster ID</div>
            </div>

            {/* List rows */}
            <div style={{ maxHeight: 'calc(100vh - 340px)', overflowY: 'auto' }}>
              {filteredReports.map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1.4fr 1fr 140px 140px 110px',
                    padding: '0.9rem 1.25rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.82rem'
                  }}
                  className="report-row"
                >
                  <div style={{ fontWeight: 800, color: 'var(--ibm-cyan)' }}>
                    #{rep.id}
                  </div>

                  <div>
                    <p style={{ color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>
                      "{rep.text}"
                    </p>
                    {rep.people_at_risk && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#fca5a5',
                        background: 'var(--critical-bg)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        marginTop: '0.3rem'
                      }}>
                        <Users size={11} /> Trapped / {rep.people_count || 1}+ at risk
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      <MapPin size={12} color="var(--ibm-cyan)" />
                      <span>{rep.location || 'Unknown location'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      <Layers size={12} color="#a855f7" />
                      <span>{rep.incident_type || rep.category}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {getSourceIcon(rep.source || '')}
                      <span style={{ fontSize: '0.78rem' }}>{rep.source || 'Citizen'}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rep.reporter}</span>
                  </div>

                  <div>
                    <span
                      className={getUrgencyBadgeClass(rep.urgency)}
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                        display: 'inline-block'
                      }}
                    >
                      {rep.urgency}
                    </span>
                  </div>

                  <div>
                    {rep.incident_id ? (
                      <button
                        onClick={() => onSelectIncidentById && onSelectIncidentById(rep.incident_id)}
                        style={{
                          background: 'rgba(56, 189, 248, 0.12)',
                          color: 'var(--ibm-cyan)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        Incident #{rep.incident_id}
                        <ExternalLink size={11} />
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Unlinked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
