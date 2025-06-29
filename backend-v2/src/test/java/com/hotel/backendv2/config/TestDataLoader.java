package com.hotel.backendv2.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Utility class for loading and clearing test data
 */
@Component
public class TestDataLoader {

    private static final Logger log = LoggerFactory.getLogger(TestDataLoader.class);

    /**
     * Basic data for all tests
     */
    @Transactional
    public void setupDefault() {
        log.info("Setting up default test data");
        // Здесь можно будет добавить тестовые данные, когда появятся репозитории
    }

    /**
     * Full cleanup of all tables
     */
    @Transactional
    public void clearDatabase() {
        log.info("Clearing database tables");
        // Здесь будет очистка таблиц через репозитории, когда они появятся
    }
}
