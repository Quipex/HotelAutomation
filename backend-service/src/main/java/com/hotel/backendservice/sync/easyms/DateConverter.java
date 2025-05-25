package com.hotel.backendservice.sync.easyms;

import java.time.LocalDate;
import java.time.ZoneOffset;

public class DateConverter {

    /**
     * Преобразует LocalDate в миллисекунды от эпохи (1970-01-01T00:00:00Z)
     * в UTC. Используется начало дня (00:00:00).
     *
     * @param date дата без времени и зоны
     * @return миллисекунды с начала эпохи в UTC
     */
    public static long convertToEpochMilli(LocalDate date) {
        return date
            .atStartOfDay()
            .toInstant(ZoneOffset.UTC)
            .toEpochMilli();
    }
}
