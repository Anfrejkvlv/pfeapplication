package com.emma.pfe.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
@Getter
@Setter
@NoArgsConstructor
@Data
@SuperBuilder
@JsonInclude(NON_NULL)
public class HttpResponse {
    private LocalDateTime timeStamp;
    private int statusCode;
    private HttpStatus httpStatus;
    private String reason;
    private String message;
    private Map<?, ?> data;
    private HttpStatus status;

    public HttpResponse(int statusCode,HttpStatus httpStatus,String reason,String message) {
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;

        this.reason = reason;
        this.message = message;
    }
}