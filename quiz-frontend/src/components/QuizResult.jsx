import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Award, CheckCircle, Clock } from 'lucide-react';

export default function QuizResult({ 
  score, 
  total, 
  timeElapsed, 
  quizTitle, 
  questions, 
  userAnswers, 
  onRetake, 
  onHome 
}) {
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    if (percentage >= 50) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const getFeedback = () => {
    if (percentage >= 80) {
      return {
        title: 'Excellent Job! 🎉',
        desc: 'You demonstrated strong knowledge on this subject.',
        badge: 'Passed',
        badgeClass: 'badge-success'
      };
    } else if (percentage >= 50) {
      return {
        title: 'Well Done! 👍',
        desc: 'You passed with a solid score. Keep practicing to reach 100%!',
        badge: 'Passed',
        badgeClass: 'badge-primary'
      };
    } else {
      return {
        title: 'Good Effort! 📚',
        desc: 'Review the questions below and give it another try.',
        badge: 'Needs Review',
        badgeClass: 'badge-warning'
      };
    }
  };

  const feedback = getFeedback();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Result Card */}
      <div className="card" style={{
        padding: '40px 32px',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <span className={`badge ${feedback.badgeClass}`} style={{ marginBottom: '14px' }}>
          {feedback.badge}
        </span>

        <h2 style={{ fontSize: '1.9rem', marginBottom: '8px' }}>
          {feedback.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '480px', margin: '0 auto 28px' }}>
          {feedback.desc}
        </p>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          maxWidth: '520px',
          margin: '0 auto 32px auto',
          backgroundColor: 'var(--bg-app)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {score}/{total}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {formatTime(timeElapsed)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            id="result-retake-btn"
            onClick={onRetake}
            className="btn btn-secondary"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>

          <button
            id="result-home-btn"
            onClick={onHome}
            className="btn btn-primary"
          >
            <Home size={16} />
            <span>Back to Quizzes</span>
          </button>
        </div>
      </div>

      {/* Answer Review */}
      <section>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Question Review</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            return (
              <div 
                key={q.id}
                className="card"
                style={{ padding: '20px 24px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Question {idx + 1}
                  </span>
                  {q.category && (
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                      {q.category}
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-heading)' }}>
                  {q.questionTitle}
                </h4>

                <div style={{
                  padding: '10px 14px',
                  backgroundColor: userAnswer ? 'var(--bg-app)' : 'var(--danger-light)',
                  border: `1px solid ${userAnswer ? 'var(--border-light)' : 'var(--danger-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Your Answer: </span>
                  <span style={{ fontWeight: 600, color: userAnswer ? 'var(--text-heading)' : 'var(--danger)' }}>
                    {userAnswer || 'Skipped'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
