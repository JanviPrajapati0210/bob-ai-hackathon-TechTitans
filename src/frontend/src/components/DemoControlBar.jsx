import React from 'react';
import { Search, Filter, Layers } from 'lucide-react';

export default function DemoControlBar({
  selectedUrgency,
  onSelectUrgency,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  incidentsCount
}) {
  const urgencyOptions = [
    { label: 'All Urgencies', value: '' },
    { label: '🔴 Critical', value: 'CRITICAL' },
    { label: '🟠 High', value: 'HIGH' },
    { label: '🟡 Medium', value: 'MEDIUM' },
    { label: '🟢 Low', value: 'LOW' },
  ];

  const categories = [
    'All Categories',
    'Rescue',
    'Fire',
    'Hazard',
    'Infrastructure',
    'Observation'
  ];

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.8)',
      padding: '0.875rem 1.5rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      {/* Search Input */}
      <div style={{
        position: 'relative',
        minWidth: '260px',
        flex: '1 1 280px'
      }}>
        <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Filter by keyword, location, or incident..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.85rem 0.5rem 2.25rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Urgency Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        {urgencyOptions.map(opt => {
          const isActive = selectedUrgency === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectUrgency(opt.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                color: isActive ? '#38bdf8' : '#94a3b8',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Category Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={15} color="#94a3b8" />
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          style={{
            padding: '0.45rem 0.75rem',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#cbd5e1',
            fontSize: '0.8rem',
            outline: 'none'
          }}
        >
          {categories.map(c => (
            <option key={c} value={c === 'All Categories' ? '' : c}>
              {c}
            </option>
          ))}
        </select>

        <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>
          Showing <strong>{incidentsCount}</strong> incidents
        </span>
      </div>
    </div>
  );
}
