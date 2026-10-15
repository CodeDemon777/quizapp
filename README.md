# Quizly - Full-Stack Quiz Application

Quizly is a modern, full-stack quiz platform built with **Spring Boot** and **React (Vite)**, with **PostgreSQL** database persistence.

---

## 🌟 Key Features

- **Interactive Quiz Flow**:
  - Live quiz timer, smooth progress bar, and clean question navigation.
  - Secure test delivery: Quiz questions are served via `QuestionWrapper` (hiding correct answers from browser inspection).
  - Server-side score validation and immediate result calculation.
- **Custom Quiz Generator**:
  - Generate quizzes by topic (Java, Python, Geography, etc.) and customized question counts.
  - Random question selection using PostgreSQL native queries.
- **Question Repository & Management**:
  - Complete CRUD support (Add, View, Update, Delete questions).
  - Search by title and filter by topic/difficulty.
  - Automatic starter data loader.
- **Clean & Accessible UI**:
  - Lightweight, approachable modern interface (no dark cyberpunk clutter).
  - High contrast readability, responsive layout, and intuitive actions.

---

## 🏗️ Architecture & Tech Stack

```
quizapp/
├── quizapp/               # Spring Boot 3 Backend
│   ├── src/main/java/com/harees/quizapp/
│   │   ├── config/        # WebConfig (CORS), DataInitializer
│   │   ├── controller/    # QuestionController, QuizController
│   │   ├── dao/           # QuestionDao, QuizDao
│   │   ├── model/         # Quiz, QuestionWrapper, Response, QuizDto
│   │   ├── service/       # QuestionService, QuizService
│   │   └── Question.java  # Persistent JPA Entity
│   └── pom.xml
└── quiz-frontend/         # React Frontend (Vite)
    ├── src/
    │   ├── components/    # Navbar, Dashboard, QuizPlay, QuizResult, QuestionBank, CreateQuizModal
    │   ├── services/      # API client
    │   ├── App.jsx
    │   └── index.css      # Custom design system
    ├── package.json
    └── vite.config.js
```

### Backend:
- **Language**: Java 25
- **Framework**: Spring Boot 3 (Spring Web, Spring Data JPA)
- **Database**: PostgreSQL (JDBC Driver)
- **Server Port**: `8081`

### Frontend:
- **Framework**: React 19 + Vite
- **Icons**: Lucide React
- **Dev Port**: `5173` (proxied to backend)

---

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+ (or Java 25)
- Node.js 18+ & npm
- PostgreSQL database running with a database named `quizdb`

### 2. Backend Setup
```bash
cd quizapp
./mvnw clean compile
./mvnw spring-boot:run
```
The backend will run on `http://localhost:8081`.

### 3. Frontend Setup
```bash
cd quiz-frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 📡 REST API Reference

### Questions (`/question`)
- `GET /question/allQuestions` - Get all questions
- `GET /question/category/{category}` - Filter questions by topic
- `GET /question/categories` - Distinct categories
- `POST /question/add` - Add new question
- `PUT /question/update/{id}` - Update question
- `DELETE /question/delete/{id}` - Delete question
- `POST /question/seed` - Populate default starter questions

### Quizzes (`/quiz`)
- `POST /quiz/create?category={topic}&numQ={count}&title={title}` - Create new quiz
- `GET /quiz/get/{id}` - Fetch quiz questions without answers
- `POST /quiz/submit/{id}` - Submit answers and calculate score
- `GET /quiz/all` - List existing quizzes
- `DELETE /quiz/delete/{id}` - Delete quiz

---

## 📄 License
MIT License
