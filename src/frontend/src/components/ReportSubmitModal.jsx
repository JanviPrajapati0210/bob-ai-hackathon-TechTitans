import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { submitReport, analyzeReport } from '../services/api';

export default function ReportSubmitModal({ isOpen, onClose, onReportSubmitted }) {
  const [reportText, setReportText] = useState('');
  const [reporterName, setReporterName] = useState('Citizen Observer');
  const [source, setSource] = useState('Citizen Mobile App');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewAnalysis, setPreviewAnalysis] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const presets = [
    {
      label: 'Flood & Trapped (Critical)',
      text: 'Water has entered our house near the railway station. Two elderly people are trapped inside and need urgent help!'
    },
    {
      label: 'Road Blockage (High)',
      text: 'Road is blocked because of fallen tree near XYZ Road.'
    },
    {
      label: 'Water Observation (Low)',
      text: 'Water level seems slightly higher than usual near North Creek, but flowing smoothly.'
    },
    {
      label: 'Duplicate Check (XYZ Road)',
      text: 'Huge tree trunk fallen across XYZ Road blocking traffic in both directions!'
    },
    {
      label: 'Novel Chemical Incident',
      text: 'Tanker truck overturned spilling hazardous chemical fumes near Highway 30 junction!'
    }
  ];

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    try {
      setIsAnalyzing(true);
      setError(null);
      const res = await analyzeReport(reportText);
      setPreviewAnalysis(res);
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await submitReport({
        text: reportText,
        reporter: reporterName,
        source: source
      });
      setSubmitResult(res);
      onReportSubmitted();
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setReportText('');
    setPreviewAnalysis(null);
    setSubmitResult(null);
    setError(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
      backdropFilter: 'blur(6px)'
    }}>
      <div style={{
        background: 'var(--modal-bg)',
        width: '100%',
        maxWidth: '650px',
        borderRadius: '14px',
        border: '1px solid var(--border-accent)',
        boxShadow: 'var(--card-shadow)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Citizen Emergency Report Ingestion
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Test live NLP extraction, embedding similarity search, and automated incident clustering.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Quick Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Test Presets (Click to load)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setReportText(p.text);
                    setPreviewAnalysis(null);
                    setSubmitResult(null);
                  }}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.35rem 0.6rem',
                    color: 'var(--ibm-cyan)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Emergency Report Text
              </label>
              <textarea
                rows={4}
                required
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="e.g. Water has entered our house near the railway station. Two elderly people are trapped inside."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Reporter
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Source Channel
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="Citizen Mobile App">Citizen Mobile App</option>
                  <option value="Citizen SMS">Citizen SMS</option>
                  <option value="Emergency Helpline">Emergency Helpline</option>
                  <option value="Field Radio">Field Radio</option>
                  <option value="Public Utilities">Public Utilities</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !reportText.trim()}
                style={{
                  background: 'rgba(138, 63, 252, 0.18)',
                  color: '#a855f7',
                  border: '1px solid rgba(138, 63, 252, 0.4)',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Sparkles size={15} />
                {isAnalyzing ? 'Analyzing...' : 'AI Pre-Analyze'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !reportText.trim()}
                style={{
                  background: 'linear-gradient(135deg, #0f62fe 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Send size={15} />
                {isSubmitting ? 'Ingesting...' : 'Submit & Ingest'}
              </button>
            </div>
          </form>

          {/* AI Pre-Analysis Output Card */}
          {previewAnalysis && (
            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginTop: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a855f7', marginBottom: '0.4rem' }}>
                AI EXTRACTION PREVIEW (Watsonx Granite / Local NLP)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div><strong>Type:</strong> <span style={{ color: 'var(--ibm-cyan)' }}>{previewAnalysis.incident_type}</span></div>
                <div><strong>Location:</strong> <span style={{ color: 'var(--ibm-cyan)' }}>{previewAnalysis.location}</span></div>
                <div><strong>Urgency:</strong> <span style={{ color: '#ef4444' }}>{previewAnalysis.urgency}</span></div>
                <div><strong>Category:</strong> <span style={{ color: '#f59e0b' }}>{previewAnalysis.category}</span></div>
                <div><strong>People at Risk:</strong> {previewAnalysis.people_at_risk ? '🚨 YES' : 'No'}</div>
                <div><strong>Est. Affected:</strong> {previewAnalysis.people_count}</div>
              </div>
            </div>
          )}

          {/* Submission Result Notification */}
          {submitResult && (
            <div style={{
              background: submitResult.is_duplicate ? 'rgba(30, 58, 138, 0.3)' : 'rgba(16, 185, 129, 0.15)',
              border: submitResult.is_duplicate ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} color={submitResult.is_duplicate ? 'var(--ibm-cyan)' : '#34d399'} />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {submitResult.is_duplicate 
                    ? `Duplicate Detected! Merged into Incident #${submitResult.incident.id}`
                    : `Novel Incident Detected! Created Incident #${submitResult.incident.id}`}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Cosine Similarity Score: <strong>{Math.round(submitResult.similarity_score * 100)}%</strong> • Updated Report Count: <strong>{submitResult.incident.report_count}</strong>
              </p>
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--critical-bg)', border: '1px solid var(--critical-border)', padding: '0.75rem', borderRadius: '8px', color: '#ef4444', marginTop: '1rem', fontSize: '0.82rem' }}>
              <AlertCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
