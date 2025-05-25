package com.hotel.backendservice.sync.easyms;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.time.LocalDate;
import java.time.Month;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DateConverterTest {

    @Test
    void convertToEpochMilli_epoch_returnsZero() {
        // The epoch date is 1970-01-01
        LocalDate epochDate = LocalDate.of(1970, 1, 1);
        long result = DateConverter.convertToEpochMilli(epochDate);
        assertEquals(0L, result);
    }

    @Test
    void convertToEpochMilli_specificDate_returnsExpectedValue() {
        // 2023-05-15
        LocalDate date = LocalDate.of(2023, 5, 15);
        // Precomputed value: 2023-05-15 00:00:00 UTC in milliseconds since epoch
        long expected = 1684108800000L;
        long result = DateConverter.convertToEpochMilli(date);
        assertEquals(expected, result);
    }

    @ParameterizedTest
    @MethodSource("provideTestDates")
    void convertToEpochMilli_variousDates_returnsExpectedValues(LocalDate date, long expectedMillis) {
        long result = DateConverter.convertToEpochMilli(date);
        assertEquals(expectedMillis, result);
    }

    private static Stream<Arguments> provideTestDates() {
        return Stream.of(
            // Epoch date
            Arguments.of(LocalDate.of(1970, 1, 1), 0L),
            // One day after epoch
            Arguments.of(LocalDate.of(1970, 1, 2), 86400000L),
            // Leap year
            Arguments.of(LocalDate.of(2020, 2, 29), 1582934400000L),
            // Recent date
            Arguments.of(LocalDate.of(2023, 12, 31), 1703980800000L),
            // Future date
            Arguments.of(LocalDate.of(2025, 6, 15), 1749945600000L)
        );
    }

    @Test
    void convertToEpochMilli_nullDate_throwsNullPointerException() {
        assertThrows(NullPointerException.class, () -> DateConverter.convertToEpochMilli(null));
    }
}
