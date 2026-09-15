import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Cpu, 
  MapPin, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Zap, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { analyzeReport, submitReport } from '../services/api';

export default function AiSandboxView({ onReportSubmitted }) {
  const [inputText, setInputText] = useState('Critical water level rise near Elm Street Bridge. 4 residents trapped on rooftop waving for help.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [submitFeedback, setSubmitFeedback] = useState(null);
  const [copied, setCopied] = useState(false);

  const testPrompts = [
    {
      title: '🚨 Trapped Flood SOS',
      text: 'Water has entered our ground floor near South Central Railway Station. 2 senior citizens trapped with medical emergency!'
    },
    {
      title: '🔥 Electrical Fire Hazard',
      text: 'High-voltage transformer exploded on Elm Street near Main intersection sparking active flame and smoke.'
    },
    {
      title: '🚧 Road Blockage',
      text: 'Uprooted oak tree blocking both lanes on Expressway 30 near exit 14. Traffic completely stopped.'
    },
    {
      title: '⚠️ Chemical Fumes Spill',
      text: 'Commercial tanker truck leaking noxious chemical vapor near Oakridge Industrial Park. Immediate evacuation advised.'
    },
    {
      title: '🟢 Normal Water Observation',
      text: 'Creek water level is slightly higher than usual following morning rain, but all drains are currently clearing.'
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    try {
      setIsAnalyzing(true);
      setSubmitFeedback(null);
      const res = await analyzeReport(inputText);
      setAnalysisResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDirectSubmit = async () => {
    if (!inputText.trim()) return;
    try {
      setIsAnalyzing(true);
      const res = await submitReport({
        text: inputText,
        reporter: 'AI Sandbox Evaluator',
        source: 'AI Sandbox Simulator'
      });
      setSubmitFeedback(res);
      if (onReportSubmitted) onReportSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyJSON = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(JSON.stringify(analysisResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Sandbox Header */}
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
            background: 'linear-gradient(135deg, #8a3ffc 0%, #0f62fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Cpu size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              AI NLP & Prioritization Sandbox
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Interactive playground to test Watsonx Granite entity extraction, priority calculation, and deduplication logic
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--ibm-cyan)' }}>
          <Sparkles size={15} />
          <span>Watsonx Granite / Local NLP Model Tester</span>
        </div>
      </div>

      {/* Main Grid: Input and Output */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 1.1fr) minmax(420px, 1.3fr)',
        gap: '1.25rem'
      }}>
        {/* Left Column: Input Prompt & Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Preset Buttons */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sample Emergency Test Scenarios
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
              {testPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(p.text);
                    setAnalysisResult(null);
                    setSubmitFeedback(null);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <span style={{ color: 'var(--ibm-cyan)', fontWeight: 700 }}>{p.title}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{p.text}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Emergency Dispatch Text
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter freeform emergency report..."
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.4
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                style={{
                  background: 'rgba(138, 63, 252, 0.18)',
                  color: '#a855f7',
                  border: '1px solid rgba(138, 63, 252, 0.4)',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <Sparkles size={15} />
                {isAnalyzing ? 'Extracting Entities...' : 'Run NLP Extraction'}
              </button>

              <button
                onClick={handleDirectSubmit}
                disabled={isAnalyzing || !inputText.trim()}
                style={{
                  background: 'linear-gradient(135deg, #0f62fe 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(15, 98, 254, 0.3)'
                }}
              >
                <Send size={15} />
                Submit & Cluster
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Extraction & Scoring Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {analysisResult ? (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-accent)',
              padding: '1.25rem',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a855f7', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Sparkles size={16} /> NLP Entity Extraction Output
                </div>
                <button
                  onClick={handleCopyJSON}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              {/* Key Values Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>INCIDENT TYPE</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ibm-cyan)', marginTop: '0.2rem' }}>
                    {analysisResult.incident_type}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>ASSIGNED URGENCY</span>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: analysisResult.urgency === 'CRITICAL' ? '#ef4444' : (analysisResult.urgency === 'HIGH' ? '#f97316' : '#eab308'), marginTop: '0.2rem' }}>
                    {analysisResult.urgency}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>EXTRACTED LOCATION</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--ibm-cyan)" /> {analysisResult.location}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>PEOPLE AT RISK</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: analysisResult.people_at_risk ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
                    {analysisResult.people_at_risk ? `🚨 YES (${analysisResult.people_count} trapped)` : 'No Immediate Risk'}
                  </div>
                </div>
              </div>

              {/* Geo Coordinates */}
              <div style={{
                background: 'var(--bg-input)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <span>Geo Coordinates (Dallas Metro):</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Lat: {analysisResult.latitude.toFixed(4)}, Lng: {analysisResult.longitude.toFixed(4)}
                </span>
              </div>

              {/* Priority Scoring Formula Breakdown */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 98, 254, 0.1) 0%, rgba(138, 63, 252, 0.1) 100%)',
                border: '1px solid var(--border-accent)',
                borderRadius: '8px',
                padding: '0.85rem 1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ibm-cyan)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Dynamic AI Priority Formula
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  <code style={{ background: 'var(--bg-tag)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                    Priority = (Urgency_Base × 25) + (Trapped_Risk × 25) + (Log(Reports) × 10) - (Resolved_Decay)
                  </code>
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px dashed var(--border-color)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <Cpu size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No NLP Extraction Active
              </h3>
              <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                Type an emergency report on the left or select a quick test scenario, then click <strong>"Run NLP Extraction"</strong>.
              </p>
            </div>
          )}

          {/* Submission Feedback */}
          {submitFeedback && (
            <div style={{
              background: submitFeedback.is_duplicate ? 'rgba(30, 58, 138, 0.3)' : 'rgba(16, 185, 129, 0.15)',
              border: submitFeedback.is_duplicate ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '1rem',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <CheckCircle2 size={18} color={submitFeedback.is_duplicate ? 'var(--ibm-cyan)' : '#34d399'} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {submitFeedback.is_duplicate 
                    ? `Deduplication Match Found! Merged into Incident #${submitFeedback.incident.id}`
                    : `Novel Incident Registered! Assigned Incident #${submitFeedback.incident.id}`}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Similarity Score: <strong>{Math.round(submitFeedback.similarity_score * 100)}%</strong> • Total Corroborated Reports: <strong>{submitFeedback.incident.report_count}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
