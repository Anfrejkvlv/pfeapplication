package com.emma.pfe.service;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;

import static com.emma.pfe.constantes.EmailConstant.*;

@Service
@Slf4j
public class EmailService {
    //@Value("${spring.mail.username}")
    //private String fromEmail;

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNewPasswordEmail(String firstName, String password, String email) throws MessagingException {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setSubject(EMAIL_SUBJECT);
            message.setTo(email);
            message.setText("Bonjour "+ firstName+", \n \n Votre nouveau mot de passe est: "+ password +"\n \n Administrateur" );
            message.setFrom(USERNAME);
            message.setSentDate(new Date());
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Username "+USERNAME+"-- Email\n"+email+"\n"+e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
