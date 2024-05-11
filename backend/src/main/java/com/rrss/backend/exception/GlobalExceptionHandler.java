package com.rrss.backend.exception;


import com.rrss.backend.dto.ErrorResponse;
import com.rrss.backend.exception.custom.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {


    /*
     * CUSTOM EXCEPTIONS
     * */

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(RoleNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OtpTokenNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(OtpTokenNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OtpTokenExpiredException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(OtpTokenExpiredException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsernameIsNotUniqueException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(UsernameIsNotUniqueException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ForumCategoryNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ForumCategoryNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TopicNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(TopicNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(PostNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
      
    @ExceptionHandler(ImageProcessingException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ImageProcessingException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(InsufficientBalanceException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(InvalidCredentialsException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidOtpTokenException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(InvalidOtpTokenException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MerchantRequestNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(MerchantRequestNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OtpTokenSendingException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(OtpTokenSendingException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(PermissionDeniedException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(PermissionDeniedException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ProductCategoryNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ProductCategoryNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ProductNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReviewFieldNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ReviewFieldNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReviewFormNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ReviewFormNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    /*
     * CUSTOM EXCEPTIONS
     * */


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handle(MethodArgumentNotValidException ex) {
        List<ErrorResponse> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(fieldError -> new ErrorResponse(
                        fieldError.getDefaultMessage()
                ))
                .collect(Collectors.toList());

        return new ResponseEntity<>(getErrorsMap(errors), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    // General Exception Handlers
    //@ExceptionHandler(Exception.class)
    //public final ResponseEntity<Map<String, List<ErrorResponse>>> handleGeneralExceptions(Exception ex) {
    //    return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    //}

    //@ExceptionHandler(RuntimeException.class)
    //public final ResponseEntity<Map<String, List<ErrorResponse>>> handleRuntimeExceptions(RuntimeException ex) {
    //    return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR);
    //}


    private Map<String, List<ErrorResponse>> getErrorsMap(List<ErrorResponse> errors) {
        Map<String, List<ErrorResponse>> errorResponse = new HashMap<>();
        errorResponse.put("errors", errors);
        return errorResponse;
    }

    private List<ErrorResponse> getErrorList(Exception ex) {
        return Collections.singletonList(
                new ErrorResponse(
                        ex.getMessage())
        );
    }

}
