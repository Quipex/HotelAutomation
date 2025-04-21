package com.hotel.backendservice.client;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.util.StringUtils;

import java.util.Arrays;

/**
 * Конвертер для преобразования массива телефонов между Java-представлением и форматом хранения в БД.
 * В PostgreSQL используется нативный тип text[], а в H2 - строка с разделителями.
 */
@Converter
public class PhoneArrayConverter implements AttributeConverter<String[], String> {

    private static final String DELIMITER = "||";

    @Override
    public String convertToDatabaseColumn(String[] phones) {
        if (phones == null || phones.length == 0) {
            return null;
        }
        return String.join(DELIMITER, phones);
    }

    @Override
    public String[] convertToEntityAttribute(String dbData) {
        if (!StringUtils.hasText(dbData)) {
            return new String[0];
        }
        
        // Обработка PostgreSQL array литерала {value1,value2}
        if (dbData.startsWith("{") && dbData.endsWith("}")) {
            String content = dbData.substring(1, dbData.length() - 1);
            if (content.isEmpty()) {
                return new String[0];
            }
            return content.split(",");
        }
        
        // Обработка строки с разделителем (для H2)
        return dbData.split(DELIMITER);
    }
} 