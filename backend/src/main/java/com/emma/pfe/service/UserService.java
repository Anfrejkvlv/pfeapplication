package com.emma.pfe.service;

import com.emma.pfe.domain.Utilisateur;
import com.emma.pfe.domain.dto.UtilisateurDTO;
import com.emma.pfe.exceptions.EmailException;
import com.emma.pfe.exceptions.domain.EmailExistException;
import com.emma.pfe.exceptions.domain.EmailNotFoundException;
import com.emma.pfe.exceptions.domain.UsernameExistException;
import jakarta.mail.MessagingException;

import java.io.IOException;
import java.util.List;

public interface UserService {

    UtilisateurDTO register(UtilisateurDTO dto) throws EmailExistException, UsernameExistException, MessagingException, EmailException;

    List<UtilisateurDTO> getAllUsers();

    UtilisateurDTO getOne(String username);

    Utilisateur findUserByUsername(String username);

    String encodePassword(String password);

    UtilisateurDTO addUser(UtilisateurDTO dto) throws UsernameExistException, MessagingException, IOException, EmailExistException;

    UtilisateurDTO updateUser(String currentUsername, UtilisateurDTO dto) throws UsernameExistException, MessagingException, EmailException, EmailExistException;

    void lockedUser(String username) throws IOException;
    void deleteUser(String username) throws IOException;

    void resetPassword(String email) throws EmailNotFoundException, EmailException, MessagingException;
    void changePassword(String email,String odlPassword, String newPassword) throws EmailNotFoundException, EmailException, EmailExistException, MessagingException;

}

