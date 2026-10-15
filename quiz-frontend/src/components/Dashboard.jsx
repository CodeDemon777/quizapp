import React, { useState } from 'react';
import { Play, Plus, BookOpen, Layers, Clock, Trash2, Sparkles, Filter, ChevronRight } from 'lucide-react';

const CATEGORY_ICONS = {
  java: '☕',
  python: '🐍',
  geography: '🌍',
  react: '⚛️',
  spring: '⚡',
};

export default function Dashboard({ 
  quizzes, 
  questions, 
  categories, 
  onStartQuiz, 
  onCreateQuizClick, 
  onManageQuestionsClick, 
  onDeleteQuiz,
  onSeedQuestions,
  loading
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredQuizzes = quizzes.filter(q => {
    if (selectedCategory === 'All') return true;
    return q.category && q.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const getCategoryBadge = (category) => {
    const key = (category || '').toLowerCase();
    const icon = CATEGORY_ICONS[key] || '📝';
    return `${icon} ${category || 'General'}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome Hero Banner */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>
            Interactive Practice
          </span>
          <h1 style={{ fontSize: '2.1rem', marginBottom: '10px' }}>
            What do you want to learn today?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Choose from ready-made topic quizzes or generate a custom quiz from our question library. Test your accuracy and track your progress.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              id="hero-create-btn"
              onClick={onCreateQuizClick}
              className="btn btn-primary"
            >
              <Plus size={18} />
              <span>Create Custom Quiz</span>
            </button>
            <button 
              id="hero-bank-btn"
              onClick={onManageQuestionsClick}
              className="btn btn-secondary"
            >
              <BookOpen size={18} />
              <span>Browse Question Bank</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          backgroundColor: 'var(--bg-app)',
          padding: '20px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {questions.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Questions
            </div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', padding: '0 16px' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {quizzes.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Quizzes
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {categories.length || 1}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Topics
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <button
          onClick={() => setSelectedCategory('All')}
          className={`btn ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          All Topics ({quizzes.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {getCategoryBadge(cat)}
          </button>
        ))}
      </section>

      {/* Quizzes List */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Available Quizzes</h2>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Showing {filteredQuizzes.length} quiz{filteredQuizzes.length === 1 ? '' : 'zes'}
          </span>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="card" style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Layers size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Quizzes Available</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px auto', fontSize: '0.94rem' }}>
              Create your first quiz in seconds, or load pre-populated practice questions to start right away.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={onCreateQuizClick} className="btn btn-primary">
                Create Quiz
              </button>
              <button onClick={onSeedQuestions} className="btn btn-secondary">
                Load Sample Data
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="card card-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge badge-primary">
                      {getCategoryBadge(quiz.category)}
                    </span>
                    <button
                      id={`delete-quiz-${quiz.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteQuiz(quiz.id);
                      }}
                      className="btn btn-ghost btn-sm"
                      title="Delete quiz"
                      style={{ color: 'var(--text-light)', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                    {quiz.title}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={15} />
                      <span>{quiz.questionCount || 5} questions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} />
                      <span>~{Math.max(2, Math.round((quiz.questionCount || 5) * 1.5))} min</span>
                    </div>
                  </div>
                </div>

                <button 
                  id={`start-quiz-btn-${quiz.id}`}
                  onClick={() => onStartQuiz(quiz.id, quiz.title)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Quiz</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
