package com.lhsk.iam.global.config;

import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.ConsoleAppender;

public class LogbackConfig {

    public static void configure() {
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        loggerContext.reset();

        // 패턴 레이아웃 인코더 설정
        PatternLayoutEncoder encoder = new PatternLayoutEncoder();
        encoder.setContext(loggerContext);
        encoder.setPattern("%date{HH:mm:ss.SSS} %-5level [%thread] %logger{0}: %msg%n");
        encoder.start();

        // 콘솔 앱 펜더 설정
        ConsoleAppender consoleAppender = new ConsoleAppender();
        consoleAppender.setContext(loggerContext);
        consoleAppender.setEncoder(encoder);
        consoleAppender.start();

        // MyBatis 및 java.sql 로거 설정
        ch.qos.logback.classic.Logger myBatisLogger = loggerContext.getLogger("org.apache.ibatis");
        myBatisLogger.setLevel(Level.DEBUG);
        myBatisLogger.addAppender(consoleAppender);

        ch.qos.logback.classic.Logger sqlLogger = loggerContext.getLogger("java.sql");
        sqlLogger.setLevel(Level.DEBUG);
        sqlLogger.addAppender(consoleAppender);
    }
}