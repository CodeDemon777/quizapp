package com.harees.quizapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.harees.quizapp.service.QuestionService;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    QuestionService questionService;

    @Override
    public void run(String... args) throws Exception {
        // Automatically seed starter questions if database is empty
        questionService.seedSampleQuestions();
    }
}
