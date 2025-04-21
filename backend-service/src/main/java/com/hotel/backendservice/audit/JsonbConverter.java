package com.hotel.backendservice.audit;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Конвертер для преобразования JSON между строковым представлением в Java и форматом хранения в БД.
 * В PostgreSQL используется нативный тип JSONB, а в H2 - строка VARCHAR.
 */
@Converter
public class JsonbConverter implements AttributeConverter<String, String> {

    private static final Logger logger = LoggerFactory.getLogger(JsonbConverter.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return null;
        }
        
        // Проверяем, является ли строка валидным JSON
        try {
            // Парсим и затем снова сериализуем для нормализации
            Object json = objectMapper.readValue(attribute, Object.class);
            return objectMapper.writeValueAsString(json);
        } catch (JsonProcessingException e) {
            logger.warn("Failed to process JSON: {}", attribute, e);
            // Если не удалось обработать как JSON, сохраняем как простую строку
            return attribute;
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        return dbData;
    }
} 