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


/**

 * 4001 = Email Verification token gönderirken email eğer db de yoksa gönderilir.gönderilirtoken suresi
 *      bittigi zaman gonderilir, eger bu gonderildiyse emaile yeni bir token gonderilmistir.
 * 4002 = user yaratırken email verified değilse
 * 4041 = user not found in database
 * 4042 = checkOtp fonskiyonunda gonderilen emaile ait token yoktur
 * 4043 = createUser fonksiyonunda gonderilen emaile ait token yoktur
 * 4011 = tutor registration kısmını bitirmeden bi yerlere girmek isterse
 *
 *
 *
 *
 *
 * 999 = Sistem atti valla bizle alakali degil
 */
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

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(TokenExpiredException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WrongOtpException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(WrongOtpException ex) {
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

    /*
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TutorRegistrationIncompleteException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(TutorRegistrationIncompleteException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(EmailAlreadyInUseException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(EmailAlreadyInUseException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(NoSuchEmailVerificationTokenException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(NoSuchEmailVerificationTokenException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmailVerificationTokenExpiredException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(EmailVerificationTokenExpiredException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WrongOtpException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(WrongOtpException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailIsNotVerifiedException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(EmailIsNotVerifiedException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ImageDoesNotExistException.class)
    public ResponseEntity<Map<String, List<ErrorResponse>>> handleNotFoundException(ImageDoesNotExistException ex) {
        return new ResponseEntity<>(getErrorsMap(getErrorList(ex)), new HttpHeaders(), HttpStatus.NOT_FOUND);
    }
     */


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
