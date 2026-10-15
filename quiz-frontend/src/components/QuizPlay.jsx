import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, AlertCircle, Send } from 'lucide-react';

export default function QuizPlay({ quizId, quizTitle, questions, onComplete, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ = questions[currentIndex];
  if (!currentQ) {
    return (
      <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
        <p>No questions found for this quiz.</p>
        <button onClick={onExit} className="btn btn-secondary" style={{ marginTop: '16px' }}>Back</button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleSelectOption = (optionText) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionText,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const responsePayload = questions.map((q) => ({
      id: q.id,
      response: answers[q.id] || '',
    }));

    try {
      await onComplete(responsePayload, answers, secondsElapsed);
    } finally {
      setSubmitting(false);
    }
  };

  const options = [
    { label: 'A', text: currentQ.option1 },
    { label: 'B', text: currentQ.option2 },
    { label: 'C', text: currentQ.option3 },
    { label: 'D', text: currentQ.option4 },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <button
          id="quiz-exit-btn"
          onClick={onExit}
          className="btn btn-ghost btn-sm"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Exit</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {quizTitle}
          </h2>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-muted)'
        }}>
          <Clock size={15} />
          <span>{formatTime(secondsElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--border-light)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        marginBottom: '28px'
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          backgroundColor: 'var(--primary)',
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.25s ease'
        }} />
      </div>

      {/* Question Card */}
      <div className="card" style={{
        padding: '36px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {currentQ.category && (
            <span className="badge badge-primary">{currentQ.category}</span>
          )}
          {currentQ.difficultylevel && (
            <span className="badge badge-neutral">{currentQ.difficultylevel}</span>
          )}
        </div>

        <h3 style={{
          fontSize: '1.35rem',
          lineHeight: 1.45,
          marginBottom: '28px',
          color: 'var(--text-heading)',
          fontWeight: 600
        }}>
          {currentQ.questionTitle}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.text;
            return (
              <div
                key={opt.label}
                id={`option-${opt.label}-${currentQ.id}`}
                onClick={() => handleSelectOption(opt.text)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-surface-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  flexShrink: 0
                }}>
                  {opt.label}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: isSelected ? 'var(--primary-hover)' : 'var(--text-body)',
                  fontWeight: isSelected ? 600 : 500,
                  flexGrow: 1
                }}>
                  {opt.text}
                </div>
                {isSelected && (
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <button
          id="quiz-prev-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="btn btn-secondary"
          style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>

        {/* Question Numbers */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {questions.map((q, idx) => {
            const hasAnswer = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                id={`pill-q-${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: isCurrent 
                    ? '2px solid var(--primary)' 
                    : '1px solid var(--border-light)',
                  backgroundColor: isCurrent 
                    ? 'var(--primary-light)' 
                    : hasAnswer 
                      ? 'var(--success-light)' 
                      : 'var(--bg-surface)',
                  color: isCurrent 
                    ? 'var(--primary)' 
                    : hasAnswer 
                      ? 'var(--success)' 
                      : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {currentIndex === questions.length - 1 ? (
          <button
            id="quiz-submit-trigger-btn"
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-primary"
          >
            <span>Finish Quiz</span>
            <Send size={16} />
          </button>
        ) : (
          <button
            id="quiz-next-btn"
            onClick={handleNext}
            className="btn btn-primary"
          >
            <span>Next</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Ready to Submit?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginBottom: '20px' }}>
              You answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <span style={{ display: 'block', color: 'var(--warning)', marginTop: '8px' }}>
                  ⚠️ {questions.length - answeredCount} question{questions.length - answeredCount > 1 ? 's are' : ' is'} still unanswered.
                </span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                id="modal-cancel-submit"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Review
              </button>
              <button
                id="modal-confirm-submit"
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Answers'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
