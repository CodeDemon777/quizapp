package com.harees.quizapp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.harees.quizapp.Question;
import com.harees.quizapp.dao.QuestionDao;
import com.harees.quizapp.dao.QuizDao;
import com.harees.quizapp.model.QuestionWrapper;
import com.harees.quizapp.model.Quiz;
import com.harees.quizapp.model.QuizDto;
import com.harees.quizapp.model.Response;

@Service
public class QuizService {

    @Autowired
    QuizDao quizDao;

    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {
        try {
            List<Question> questions;
            if (category == null || category.trim().isEmpty() || category.equalsIgnoreCase("All")) {
                questions = questionDao.findRandomQuestions(numQ);
            } else {
                questions = questionDao.findRandomQuestionsByCategory(category, numQ);
                if (questions.size() < numQ) {
                    // Fallback to random if specific category doesn't have enough questions
                    List<Question> extra = questionDao.findRandomQuestions(numQ);
                    for (Question eq : extra) {
                        if (!questions.contains(eq) && questions.size() < numQ) {
                            questions.add(eq);
                        }
                    }
                }
            }

            if (questions.isEmpty()) {
                return new ResponseEntity<>("No questions available to create quiz", HttpStatus.BAD_REQUEST);
            }

            Quiz quiz = new Quiz();
            quiz.setTitle(title != null && !title.trim().isEmpty() ? title : (category + " Quiz"));
            quiz.setQuestions(questions);
            Quiz saved = quizDao.save(quiz);

            return new ResponseEntity<>("Quiz created successfully with ID: " + saved.getId(), HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to create quiz: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
        try {
            Optional<Quiz> quiz = quizDao.findById(id);
            if (quiz.isEmpty()) {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
            }

            List<Question> questionsFromDB = quiz.get().getQuestions();
            List<QuestionWrapper> questionsForUser = new ArrayList<>();
            for (Question q : questionsFromDB) {
                QuestionWrapper qw = new QuestionWrapper(
                        q.getId(),
                        q.getQuestionTitle(),
                        q.getOption1(),
                        q.getOption2(),
                        q.getOption3(),
                        q.getOption4(),
                        q.getCategory(),
                        q.getDifficultylevel()
                );
                questionsForUser.add(qw);
            }

            return new ResponseEntity<>(questionsForUser, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Integer> calculateResult(Integer id, List<Response> responses) {
        try {
            Optional<Quiz> quiz = quizDao.findById(id);
            if (quiz.isEmpty()) {
                return new ResponseEntity<>(0, HttpStatus.NOT_FOUND);
            }

            List<Question> questions = quiz.get().getQuestions();
            int right = 0;

            for (Response response : responses) {
                if (response.getResponse() == null) continue;
                for (Question question : questions) {
                    if (question.getId().equals(response.getId())) {
                        if (response.getResponse().trim().equalsIgnoreCase(question.getRightAnswer().trim())) {
                            right++;
                        }
                        break;
                    }
                }
            }

            return new ResponseEntity<>(right, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(0, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<List<QuizDto>> getAllQuizzes() {
        try {
            List<Quiz> quizzes = quizDao.findAll();
            List<QuizDto> dtos = new ArrayList<>();
            for (Quiz q : quizzes) {
                String cat = "Mixed";
                if (q.getQuestions() != null && !q.getQuestions().isEmpty() && q.getQuestions().get(0) != null) {
                    cat = q.getQuestions().get(0).getCategory();
                }
                dtos.add(new QuizDto(
                        q.getId(),
                        q.getTitle(),
                        q.getQuestions() != null ? q.getQuestions().size() : 0,
                        cat
                ));
            }
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deleteQuiz(Integer id) {
        try {
            if (quizDao.existsById(id)) {
                quizDao.deleteById(id);
                return new ResponseEntity<>("Quiz deleted successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Quiz not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete quiz", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
