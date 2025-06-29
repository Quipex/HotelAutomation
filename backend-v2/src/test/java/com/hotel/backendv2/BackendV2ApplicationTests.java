package com.hotel.backendv2;

import com.hotel.backendv2.config.AbstractIntegrationTest;
import com.hotel.backendv2.config.NoopEasymsRestLogic;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Import;

@Import(NoopEasymsRestLogic.class)
class BackendV2ApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {
        // Этот тест проверяет, что контекст Spring успешно загружается
        // Если тест проходит, значит приложение корректно стартует
    }
}
