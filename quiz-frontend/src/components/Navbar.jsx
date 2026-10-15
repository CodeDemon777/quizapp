import React from 'react';
import { BookOpen, PlusCircle, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendOnline, onQuickPlay }) {
  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      marginBottom: '32px'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        paddingTop: 0,
        paddingBottom: 0
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          id="nav-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
              Quizly
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className="btn btn-ghost"
            style={{
              color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-muted)',
              backgroundColor: activeTab === 'dashboard' ? 'var(--primary-light)' : 'transparent',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            Quizzes
          </button>

          <button
            id="nav-tab-questions"
            onClick={() => setActiveTab('questions')}
            className="btn btn-ghost"
            style={{
              color: activeTab === 'questions' ? 'var(--primary)' : 'var(--text-muted)',
              backgroundColor: activeTab === 'questions' ? 'var(--primary-light)' : 'transparent',
              fontWeight: activeTab === 'questions' ? 700 : 500,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            Question Bank
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Connection status badge */}
          <div 
            title={backendOnline ? "Backend connected" : "Backend unreachable"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: backendOnline ? 'var(--success-light)' : 'var(--danger-light)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: backendOnline ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${backendOnline ? 'var(--success-border)' : 'var(--danger-border)'}`
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: backendOnline ? 'var(--success)' : 'var(--danger)'
            }} />
            <span>{backendOnline ? 'Online' : 'Offline'}</span>
          </div>

          <button
            id="nav-create-btn"
            onClick={() => setActiveTab('create-quiz')}
            className="btn btn-secondary btn-sm"
          >
            <PlusCircle size={16} />
            <span>New Quiz</span>
          </button>

          <button
            id="nav-quick-btn"
            onClick={onQuickPlay}
            className="btn btn-primary btn-sm"
          >
            <Sparkles size={16} />
            <span>Quick Start</span>
          </button>
        </div>
      </div>
    </header>
  );
}
