package com.hotel.backendservice.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
    List<FieldErrorMessage> fieldErrors = new ArrayList<>();

    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      fieldErrors.add(new FieldErrorMessage(fieldName, errorMessage));
    });

    ErrorResponse errorResponse = new ErrorResponse(
      LocalDateTime.now().toString(),
      HttpStatus.BAD_REQUEST.value(),
      fieldErrors
    );

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
    List<FieldErrorMessage> errors = new ArrayList<>();
    errors.add(new FieldErrorMessage("error", ex.getMessage()));

    ErrorResponse errorResponse = new ErrorResponse(
      LocalDateTime.now().toString(),
      HttpStatus.BAD_REQUEST.value(),
      errors
    );

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  @Data
  @AllArgsConstructor
  public static class ErrorResponse {
    private String timestamp;
    private int status;
    private List<FieldErrorMessage> errors;
  }

  @Data
  @AllArgsConstructor
  public static class FieldErrorMessage {
    private String field;
    private String message;
  }
}
