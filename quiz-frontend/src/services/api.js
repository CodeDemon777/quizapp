const API_BASE_URL = 'http://localhost:8081';

/**
 * Helper to fetch with error handling and fallback
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Questions API
  async getAllQuestions() {
    return request('/question/allQuestions');
  },

  async getQuestionsByCategory(category) {
    return request(`/question/category/${encodeURIComponent(category)}`);
  },

  async getCategories() {
    return request('/question/categories');
  },

  async addQuestion(question) {
    return request('/question/add', {
      method: 'POST',
      body: JSON.stringify(question),
    });
  },

  async updateQuestion(id, question) {
    return request(`/question/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    });
  },

  async deleteQuestion(id) {
    return request(`/question/delete/${id}`, {
      method: 'DELETE',
    });
  },

  async seedQuestions() {
    return request('/question/seed', {
      method: 'POST',
    });
  },

  // Quiz API
  async createQuiz(category, numQ, title) {
    const params = new URLSearchParams({
      category: category || 'All',
      numQ: numQ || 5,
      title: title || `${category || 'General'} Quiz`,
    });
    return request(`/quiz/create?${params.toString()}`, {
      method: 'POST',
    });
  },

  async getQuizQuestions(id) {
    return request(`/quiz/get/${id}`);
  },

  async submitQuiz(id, responses) {
    return request(`/quiz/submit/${id}`, {
      method: 'POST',
      body: JSON.stringify(responses),
    });
  },

  async getAllQuizzes() {
    return request('/quiz/all');
  },

  async deleteQuiz(id) {
    return request(`/quiz/delete/${id}`, {
      method: 'DELETE',
    });
  },

  async checkHealth() {
    try {
      await fetch(`${API_BASE_URL}/question/allQuestions`, { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }
};
