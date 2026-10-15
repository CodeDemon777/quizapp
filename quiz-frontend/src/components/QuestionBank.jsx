import React, { useState } from 'react';
import { Plus, Search, Trash2, Check, X, Sparkles, BookOpen } from 'lucide-react';

export default function QuestionBank({ 
  questions, 
  categories, 
  onAddQuestion, 
  onDeleteQuestion, 
  onSeedQuestions,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    questionTitle: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    rightAnswer: '',
    category: 'Java',
    difficultylevel: 'Easy'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.questionTitle && q.questionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || (q.category && q.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.questionTitle.trim()) {
      setError('Please provide a question title');
      return;
    }
    if (!formData.option1.trim() || !formData.option2.trim() || !formData.option3.trim() || !formData.option4.trim()) {
      setError('Please fill in all 4 options');
      return;
    }
    if (!formData.rightAnswer.trim()) {
      setError('Please select which option is correct');
      return;
    }

    setSubmitting(true);
    try {
      await onAddQuestion(formData);
      setShowAddModal(false);
      setFormData({
        questionTitle: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        rightAnswer: '',
        category: 'Java',
        difficultylevel: 'Easy'
      });
    } catch (err) {
      setError(err.message || 'Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Question Bank</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
            {questions.length} total question{questions.length === 1 ? '' : 's'} in your library
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id="seed-questions-btn"
            onClick={onSeedQuestions}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={16} />
            <span>Load Sample Data</span>
          </button>

          <button
            id="open-add-question-modal-btn"
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input
            id="search-questions-input"
            type="text"
            className="form-control"
            placeholder="Search questions by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ minWidth: '160px' }}>
          <select
            id="filter-category-select"
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Topics ({questions.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading questions...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <BookOpen size={40} style={{ color: 'var(--text-light)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No questions found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
            {questions.length === 0 
              ? 'Your question bank is empty. Load sample questions to get started!' 
              : 'Try a different search term or topic filter.'}
          </p>
          {questions.length === 0 && (
            <button onClick={onSeedQuestions} className="btn btn-primary btn-sm">
              Load Sample Questions
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge badge-primary">{q.category || 'General'}</span>
                    <span className="badge badge-neutral">{q.difficultylevel || 'Easy'}</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-heading)' }}>
                    {q.questionTitle}
                  </h4>
                </div>

                <button
                  id={`delete-question-btn-${q.id}`}
                  onClick={() => onDeleteQuestion(q.id)}
                  className="btn btn-ghost btn-sm"
                  title="Delete question"
                  style={{ color: 'var(--danger)', padding: '6px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Options pills */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '8px'
              }}>
                {[
                  { text: q.option1, label: 'A' },
                  { text: q.option2, label: 'B' },
                  { text: q.option3, label: 'C' },
                  { text: q.option4, label: 'D' }
                ].map((opt, i) => {
                  const isRight = q.rightAnswer && opt.text && q.rightAnswer.trim() === opt.text.trim();
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: isRight ? 'var(--success-light)' : 'var(--bg-app)',
                        border: `1px solid ${isRight ? 'var(--success-border)' : 'var(--border-light)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.86rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        backgroundColor: isRight ? 'var(--success)' : 'var(--bg-surface-subtle)',
                        color: isRight ? '#fff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {opt.label}
                      </span>
                      <span style={{ color: isRight ? 'var(--success)' : 'var(--text-body)', fontWeight: isRight ? 600 : 400 }}>
                        {opt.text}
                      </span>
                      {isRight && <Check size={14} color="var(--success)" style={{ marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Question</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
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

            <form onSubmit={handleCreateQuestion}>
              <div className="form-group">
                <label className="form-label" htmlFor="new-q-title">Question Text</label>
                <textarea
                  id="new-q-title"
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Which method in React is used to manage component state?"
                  value={formData.questionTitle}
                  onChange={(e) => handleInputChange('questionTitle', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="new-q-opt1">Option A</label>
                  <input
                    id="new-q-opt1"
                    type="text"
                    className="form-control"
                    placeholder="First option"
                    value={formData.option1}
                    onChange={(e) => handleInputChange('option1', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="new-q-opt2">Option B</label>
                  <input
                    id="new-q-opt2"
                    type="text"
                    className="form-control"
                    placeholder="Second option"
                    value={formData.option2}
                    onChange={(e) => handleInputChange('option2', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="new-q-opt3">Option C</label>
                  <input
                    id="new-q-opt3"
                    type="text"
                    className="form-control"
                    placeholder="Third option"
                    value={formData.option3}
                    onChange={(e) => handleInputChange('option3', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="new-q-opt4">Option D</label>
                  <input
                    id="new-q-opt4"
                    type="text"
                    className="form-control"
                    placeholder="Fourth option"
                    value={formData.option4}
                    onChange={(e) => handleInputChange('option4', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-q-right">Correct Answer</label>
                <select
                  id="new-q-right"
                  className="form-control"
                  value={formData.rightAnswer}
                  onChange={(e) => handleInputChange('rightAnswer', e.target.value)}
                  required
                >
                  <option value="">Choose which option is correct...</option>
                  {formData.option1 && <option value={formData.option1}>Option A: {formData.option1}</option>}
                  {formData.option2 && <option value={formData.option2}>Option B: {formData.option2}</option>}
                  {formData.option3 && <option value={formData.option3}>Option C: {formData.option3}</option>}
                  {formData.option4 && <option value={formData.option4}>Option D: {formData.option4}</option>}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-q-cat">Topic</label>
                  <input
                    id="new-q-cat"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Java, Python, React"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-q-diff">Difficulty</label>
                  <select
                    id="new-q-diff"
                    className="form-control"
                    value={formData.difficultylevel}
                    onChange={(e) => handleInputChange('difficultylevel', e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  id="submit-new-question-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
