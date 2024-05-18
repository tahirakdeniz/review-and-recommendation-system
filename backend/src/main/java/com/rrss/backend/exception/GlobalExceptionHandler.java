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
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(RoleNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OtpTokenNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(OtpTokenNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OtpTokenExpiredException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(OtpTokenExpiredException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsernameIsNotUniqueException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(UsernameIsNotUniqueException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ForumCategoryNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(ForumCategoryNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TopicNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(TopicNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PostNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(PostNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ImageProcessingException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(ImageProcessingException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(InsufficientBalanceException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(InvalidCredentialsException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidOtpTokenException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleException(InvalidOtpTokenException ex) {
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

    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ReviewNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ReviewReplyNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ReviewReplyNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InteractionWeightAlreadyExistException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(InteractionWeightAlreadyExistException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(InvalidRequestException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InteractionWeightNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(InteractionWeightNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductCategoryAlreadyExistException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ProductCategoryAlreadyExistException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
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
