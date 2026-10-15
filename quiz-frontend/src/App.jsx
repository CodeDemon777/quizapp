import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QuizPlay from './components/QuizPlay';
import QuizResult from './components/QuizResult';
import CreateQuizModal from './components/CreateQuizModal';
import QuestionBank from './components/QuestionBank';
import { api } from './services/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'questions' | 'create-quiz' | 'play' | 'result'
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Active quiz session states
  const [activeQuiz, setActiveQuiz] = useState(null); // { id, title, questions }
  const [quizResult, setQuizResult] = useState(null); // { score, total, timeElapsed, userAnswers }

  // Modals & Notifications
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial load
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const isHealthy = await api.checkHealth();
      setBackendOnline(isHealthy);

      if (isHealthy) {
        const [qList, catList, quizList] = await Promise.all([
          api.getAllQuestions().catch(() => []),
          api.getCategories().catch(() => []),
          api.getAllQuizzes().catch(() => [])
        ]);

        setQuestions(Array.isArray(qList) ? qList : []);
        setCategories(Array.isArray(catList) ? catList : []);
        setQuizzes(Array.isArray(quizList) ? quizList : []);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleStartQuiz = async (quizId, quizTitle) => {
    try {
      setLoading(true);
      const quizQuestions = await api.getQuizQuestions(quizId);
      if (!quizQuestions || quizQuestions.length === 0) {
        showToast('This quiz has no questions or could not be loaded.', 'error');
        return;
      }
      setActiveQuiz({
        id: quizId,
        title: quizTitle || 'Quiz Challenge',
        questions: quizQuestions,
      });
      setActiveTab('play');
    } catch (err) {
      showToast('Failed to start quiz: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteQuiz = async (responses, userAnswers, timeElapsed) => {
    try {
      const score = await api.submitQuiz(activeQuiz.id, responses);
      setQuizResult({
        score: typeof score === 'number' ? score : parseInt(score, 10) || 0,
        total: activeQuiz.questions.length,
        timeElapsed,
        userAnswers,
        quizTitle: activeQuiz.title,
        questions: activeQuiz.questions
      });
      setActiveTab('result');
      showToast('Quiz submitted successfully!');
    } catch (err) {
      showToast('Error calculating score: ' + err.message, 'error');
    }
  };

  const handleCreateQuiz = async (category, numQ, title) => {
    try {
      await api.createQuiz(category, numQ, title);
      showToast(`Quiz "${title}" created successfully!`);
      // Reload quizzes list
      const quizList = await api.getAllQuizzes().catch(() => []);
      setQuizzes(quizList);
      setShowCreateModal(false);

      // Auto start the newly created quiz if desired
      if (quizList.length > 0) {
        const latest = quizList[quizList.length - 1];
        handleStartQuiz(latest.id, latest.title);
      }
    } catch (err) {
      showToast('Failed to create quiz: ' + err.message, 'error');
      throw err;
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await api.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      showToast('Quiz deleted successfully.');
    } catch (err) {
      showToast('Failed to delete quiz: ' + err.message, 'error');
    }
  };

  const handleAddQuestion = async (newQuestionData) => {
    try {
      await api.addQuestion(newQuestionData);
      showToast('Question successfully added to bank!');
      // Refresh questions and categories
      const [qList, catList] = await Promise.all([
        api.getAllQuestions(),
        api.getCategories()
      ]);
      setQuestions(qList);
      setCategories(catList);
    } catch (err) {
      showToast('Failed to add question: ' + err.message, 'error');
      throw err;
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      showToast('Question deleted.');
    } catch (err) {
      showToast('Failed to delete question: ' + err.message, 'error');
    }
  };

  const handleSeedQuestions = async () => {
    try {
      const res = await api.seedQuestions();
      showToast(typeof res === 'string' ? res : 'Starter questions loaded successfully!');
      loadInitialData();
    } catch (err) {
      showToast('Failed to seed questions: ' + err.message, 'error');
    }
  };

  const handleQuickPlay = async () => {
    if (quizzes.length > 0) {
      // Pick first or random quiz
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      handleStartQuiz(randomQuiz.id, randomQuiz.title);
    } else {
      setShowCreateModal(true);
    }
  };

  return (
    <div className="quiz-app-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(8px)',
          fontWeight: 600,
          fontSize: '0.92rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'create-quiz') {
            setShowCreateModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        backendOnline={backendOnline}
        onQuickPlay={handleQuickPlay}
      />

      <main className="app-container">
        {/* Play Quiz View */}
        {activeTab === 'play' && activeQuiz && (
          <QuizPlay
            quizId={activeQuiz.id}
            quizTitle={activeQuiz.title}
            questions={activeQuiz.questions}
            onComplete={handleCompleteQuiz}
            onExit={() => setActiveTab('dashboard')}
          />
        )}

        {/* Quiz Result View */}
        {activeTab === 'result' && quizResult && (
          <QuizResult
            score={quizResult.score}
            total={quizResult.total}
            timeElapsed={quizResult.timeElapsed}
            quizTitle={quizResult.quizTitle}
            questions={quizResult.questions}
            userAnswers={quizResult.userAnswers}
            onRetake={() => handleStartQuiz(activeQuiz.id, activeQuiz.title)}
            onHome={() => setActiveTab('dashboard')}
          />
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <Dashboard
            quizzes={quizzes}
            questions={questions}
            categories={categories}
            onStartQuiz={handleStartQuiz}
            onCreateQuizClick={() => setShowCreateModal(true)}
            onManageQuestionsClick={() => setActiveTab('questions')}
            onDeleteQuiz={handleDeleteQuiz}
            onSeedQuestions={handleSeedQuestions}
            loading={loading}
          />
        )}

        {/* Question Bank View */}
        {activeTab === 'questions' && (
          <QuestionBank
            questions={questions}
            categories={categories}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onSeedQuestions={handleSeedQuestions}
            loading={loading}
          />
        )}
      </main>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <CreateQuizModal
          categories={categories}
          questions={questions}
          onClose={() => setShowCreateModal(false)}
          onQuizCreated={handleCreateQuiz}
        />
      )}
    </div>
  );
}
