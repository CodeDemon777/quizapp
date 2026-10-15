package com.harees.quizapp.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.harees.quizapp.Question;
import com.harees.quizapp.dao.QuestionDao;

@Service
public class QuestionService {

    @Autowired
    QuestionDao questionDao;

    public ResponseEntity<List<Question>> getAllQuestions() {
        try {
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category) {
        try {
            return new ResponseEntity<>(questionDao.findByCategory(category), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<List<String>> getAllCategories() {
        try {
            List<String> categories = questionDao.findDistinctCategories();
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<String> addQuestion(Question question) {
        try {
            questionDao.save(question);
            return new ResponseEntity<>("Question added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to add question", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> updateQuestion(Integer id, Question questionDetails) {
        try {
            Optional<Question> opt = questionDao.findById(id);
            if (opt.isPresent()) {
                Question existing = opt.get();
                existing.setQuestionTitle(questionDetails.getQuestionTitle());
                existing.setOption1(questionDetails.getOption1());
                existing.setOption2(questionDetails.getOption2());
                existing.setOption3(questionDetails.getOption3());
                existing.setOption4(questionDetails.getOption4());
                existing.setRightAnswer(questionDetails.getRightAnswer());
                existing.setCategory(questionDetails.getCategory());
                existing.setDifficultylevel(questionDetails.getDifficultylevel());
                questionDao.save(existing);
                return new ResponseEntity<>("Question updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to update question", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deleteQuestion(Integer id) {
        try {
            if (questionDao.existsById(id)) {
                questionDao.deleteById(id);
                return new ResponseEntity<>("Question deleted successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Question not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete question", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> seedSampleQuestions() {
        try {
            long count = questionDao.count();
            if (count > 0) {
                return new ResponseEntity<>("Questions already exist (" + count + " found).", HttpStatus.OK);
            }

            List<Question> samples = Arrays.asList(
                createSample("What is the default port for Spring Boot applications?", "8080", "8081", "3000", "5432", "8080", "Spring Boot", "Easy"),
                createSample("Which annotation is used to mark a class as a Spring REST Controller?", "@Controller", "@RestController", "@Service", "@Component", "@RestController", "Spring Boot", "Easy"),
                createSample("What does JPA stand for in Java?", "Java Process Architecture", "Java Persistence API", "Java Program Access", "Java Protocol Adapter", "Java Persistence API", "Java", "Easy"),
                createSample("Which Java collection does not allow duplicate elements?", "List", "Set", "ArrayList", "Vector", "Set", "Java", "Easy"),
                createSample("Which keyword is used to prevent method overriding in Java?", "static", "abstract", "final", "const", "final", "Java", "Medium"),
                createSample("Which method in React is invoked immediately after a component is mounted (Class component)?", "componentWillMount", "componentDidMount", "render", "componentUpdate", "componentDidMount", "React", "Easy"),
                createSample("What hook is used to perform side effects in React function components?", "useState", "useMemo", "useEffect", "useCallback", "useEffect", "React", "Easy"),
                createSample("In Python, which keyword is used to create an anonymous function?", "def", "lambda", "func", "anonymous", "lambda", "Python", "Easy"),
                createSample("Which data type is immutable in Python?", "List", "Dictionary", "Tuple", "Set", "Tuple", "Python", "Medium"),
                createSample("What is the time complexity of searching an element in a balanced Binary Search Tree?", "O(1)", "O(n)", "O(log n)", "O(n log n)", "O(log n)", "Computer Science", "Medium")
            );

            questionDao.saveAll(samples);
            return new ResponseEntity<>("Successfully seeded 10 sample questions!", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to seed sample questions: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Question createSample(String title, String o1, String o2, String o3, String o4, String right, String category, String diff) {
        Question q = new Question();
        q.setQuestionTitle(title);
        q.setOption1(o1);
        q.setOption2(o2);
        q.setOption3(o3);
        q.setOption4(o4);
        q.setRightAnswer(right);
        q.setCategory(category);
        q.setDifficultylevel(diff);
        return q;
    }
}
