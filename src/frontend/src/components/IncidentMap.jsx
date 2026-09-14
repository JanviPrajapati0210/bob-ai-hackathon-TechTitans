import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Radio } from 'lucide-react';

export default function IncidentMap({ 
  incidents = [], 
  selectedIncident, 
  onSelectIncident 
}) {
  const [hoveredIncident, setHoveredIncident] = useState(null);

  // Map coordinate bounds covering our emergency grid
  // Lat range roughly: 32.73 to 32.85 (diff ~ 0.12)
  // Lng range roughly: -96.85 to -96.75 (diff ~ 0.10)
  const minLat = 32.730;
  const maxLat = 32.850;
  const minLng = -96.850;
  const maxLng = -96.750;

  const projectCoords = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    // Clamp to 5% - 95% margins
    const clampedX = Math.min(Math.max(x, 8), 92);
    const clampedY = Math.min(Math.max(y, 8), 92);
    return { x: clampedX, y: clampedY };
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      case 'LOW': return '#10b981';
      default: return '#38bdf8';
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '340px',
      borderRadius: '12px',
      background: 'radial-gradient(ellipse at center, #111e3b 0%, #080d1a 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.7)'
    }}>
      {/* Tactical Grid Background */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.18 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Radar Rings */}
        <circle cx="50%" cy="50%" r="90" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="4,4" />
        <circle cx="50%" cy="50%" r="160" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6,6" />
      </svg>

      {/* Map Header Overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 10,
        background: 'rgba(15, 23, 42, 0.75)',
        padding: '0.35rem 0.75rem',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(6px)'
      }}>
        <Radio size={14} color="#38bdf8" className="radar-pulse" />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.05em' }}>
          TACTICAL DISASTER GEO-GRID
        </span>
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>• Dallas Metro Zone</span>
      </div>

      {/* Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '14px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '0.35rem 0.65rem',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.7rem',
        color: '#94a3b8'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Critical
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></span> High
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }}></span> Medium
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span> Low
        </div>
      </div>

      {/* Incident Pins */}
      {incidents.map((incident) => {
        const { x, y } = projectCoords(incident.latitude, incident.longitude);
        const isSelected = selectedIncident && selectedIncident.id === incident.id;
        const color = getUrgencyColor(incident.urgency);
        const isCritical = incident.urgency === 'CRITICAL';

        return (
          <div
            key={incident.id}
            onClick={() => onSelectIncident(incident)}
            onMouseEnter={() => setHoveredIncident(incident)}
            onMouseLeave={() => setHoveredIncident(null)}
            style={{
              position: 'absolute',
              top: `${y}%`,
              left: `${x}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: isSelected ? 30 : 20
            }}
          >
            {/* Pulsing ring for critical alerts */}
            {isCritical && (
              <div
                className="radar-pulse"
                style={{
                  position: 'absolute',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.35)',
                  top: '-7px',
                  left: '-7px'
                }}
              />
            )}

            {/* Selected Crosshair Halo */}
            {isSelected && (
              <div style={{
                position: 'absolute',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px dashed #38bdf8',
                top: '-11px',
                left: '-11px',
                animation: 'spin 8s linear infinite'
              }} />
            )}

            {/* Pin Badge */}
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: color,
              border: isSelected ? '2.5px solid #ffffff' : '2px solid #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 800,
              boxShadow: `0 0 10px ${color}`
            }}>
              {incident.report_count}
            </div>

            {/* Tooltip on Hover */}
            {hoveredIncident && hoveredIncident.id === incident.id && (
              <div style={{
                position: 'absolute',
                bottom: '26px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#f8fafc',
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.72rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: 40
              }}>
                <div>{incident.title}</div>
                <div style={{ color: color, fontSize: '0.65rem', marginTop: '2px' }}>
                  {incident.urgency} • {incident.report_count} Reports
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
