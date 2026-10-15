import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function CreateQuizModal({ categories, questions, onClose, onQuizCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories.length > 0 ? categories[0] : 'All');
  const [numQ, setNumQ] = useState(5);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const availableCount = category === 'All' 
    ? questions.length 
    : questions.filter(q => q.category && q.category.toLowerCase() === category.toLowerCase()).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const quizTitle = title.trim() || `${category} Quiz`;
      await onQuizCreated(category, Math.min(numQ, Math.max(1, availableCount)), quizTitle);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create quiz');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create a New Quiz</h3>
          <button
            id="close-create-quiz-modal"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--danger-light)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--danger)',
            fontSize: '0.88rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-title-input">Quiz Name</label>
            <input
              id="quiz-title-input"
              type="text"
              className="form-control"
              placeholder={`e.g. ${category} Quick Test`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-category-select">Topic / Category</label>
            <select
              id="quiz-category-select"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Topics (Mixed)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {availableCount} questions available in this topic
            </span>
          </div>

          {/* Number of questions */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="quiz-num-slider">Number of Questions</label>
              <span style={{
                fontWeight: 700,
                color: 'var(--primary)',
                fontSize: '0.9rem',
                backgroundColor: 'var(--primary-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {numQ}
              </span>
            </div>
            <input
              id="quiz-num-slider"
              type="range"
              min="1"
              max={Math.max(5, availableCount)}
              value={numQ}
              onChange={(e) => setNumQ(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                marginTop: '8px',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
            <button
              id="cancel-create-quiz-btn"
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={creating}
            >
              Cancel
            </button>
            <button
              id="submit-create-quiz-btn"
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={creating || questions.length === 0}
            >
              <Sparkles size={16} />
              <span>{creating ? 'Creating...' : 'Create & Start'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
