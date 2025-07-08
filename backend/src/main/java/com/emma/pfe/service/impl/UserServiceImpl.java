package com.emma.pfe.service.impl;

import com.emma.pfe.domain.UserPrincipal;
import com.emma.pfe.domain.Utilisateur;
import com.emma.pfe.domain.dto.UtilisateurDTO;
import com.emma.pfe.domain.entity.Personne;
import com.emma.pfe.domain.mapper.UserMapper;
import com.emma.pfe.enumeration.Role;
import com.emma.pfe.exceptions.EmailException;
import com.emma.pfe.exceptions.domain.EmailExistException;
import com.emma.pfe.exceptions.domain.EmailNotFoundException;
import com.emma.pfe.exceptions.domain.UsernameExistException;
import com.emma.pfe.repository.PersonneRepo;
import com.emma.pfe.repository.UserRepository;
import com.emma.pfe.service.EmailService;
import com.emma.pfe.service.LoginAttemptService;
import com.emma.pfe.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static com.emma.pfe.constantes.UserImplConstant.*;

@Service
@Transactional
@Qualifier("userDetailsService")
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;
    private final UserMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PersonneRepo personneRepo;



    @Autowired
    public UserServiceImpl(UserRepository userRepository, LoginAttemptService loginAttemptService, UserMapper mapper, BCryptPasswordEncoder passwordEncoder, EmailService emailService, PersonneRepo personneRepo) {
        this.userRepository = userRepository;
        this.loginAttemptService = loginAttemptService;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.personneRepo = personneRepo;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur user=findUserByUsername(username);
        if(user==null){
            log.info("USERNAME {}",username);
            log.error(USER_NOT_FOUND_BY_USERNAME + "{}", username);
            throw new UsernameNotFoundException(username);
        }else{
            validateLoginAttempt(user);
            user.setLastLoginDate(new Date());
            user=userRepository.save(user);
            log.info(FOUND_USER_BY_USERNAME + "{}", username);
            return new UserPrincipal(user);
        }
    }

    public void validateLoginAttempt(Utilisateur user) {
            if (user.isNotLocked()){
                user.setNotLocked(!loginAttemptService.hasExceededMaxAttempts(user.getUsername()));
            }else {
                loginAttemptService.evictUserFromLoginAttemptCache(user.getUsername());
            }
    }

    @Override
    public UtilisateurDTO register(UtilisateurDTO dto) throws EmailExistException, UsernameExistException, MessagingException {
        Utilisateur user ;
        final String password = generatePassword();
        dto.setRole(getRoleEnumName(dto.getRole()).name());
        dto.setAuthorities(getRoleEnumName(dto.getRole()).getAuthorities());
        dto.setUserId(generateId());
        dto.setPassword(encodePassword(password));
        dto.setActif(true);
        dto.setNotLocked(true);
        dto.setJoinedDate(LocalDateTime.now());

        user = userRepository.findByEmail(dto.getEmail());

        if (user == null) {
            // Vérifier s'il existe une Personne
            Personne p = personneRepo.findByEmail(dto.getEmail());

            if (p != null) {
                user = mapper.fromPersonneAndDto(p, dto);
                user.setId(p.getId());
		//user.setVersion(p.getVersion());
            } else {
                // Création complète
                log.info("Personne n'existe pas");
                dto.setUsername(dto.getEmail());
                user = mapper.toEntity1(dto);
		//user.setVersion(0);
            }
        } else {
            // Utilisateur existe déjà
            validateNewUsername(StringUtils.EMPTY, dto.getEmail());
            if (user.getId() != 0) {
		//dto.setVersion(user.getVersion());
                mapper.updateFromDto(dto, user);
            }
        }

        Utilisateur userS = userRepository.save(user);
        log.info("New user password: {}", password);
        emailService.sendNewPasswordEmail(dto.getNom()+" " +dto.getPrenom(), password, dto.getEmail());
        return mapper.toDto(userS);
    }

    @Override
    public List<UtilisateurDTO> getAllUsers() {
        List<Utilisateur> users=userRepository.findAll();
        return users
                .stream().map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UtilisateurDTO getOne(String username) {
        Utilisateur user=findUserByUsername(username);
        if (user==null){
            throw new UsernameNotFoundException(username);
        }
        return mapper.toDto(user);
    }

    @Override
    public UtilisateurDTO addUser(UtilisateurDTO dto) throws UsernameExistException, EmailExistException {
        Utilisateur user=validateNewUsername(StringUtils.EMPTY,dto.getEmail());
        Personne personne;

        dto.setRole(getRoleEnumName(dto.getRole()).name());
        dto.setAuthorities(getRoleEnumName(dto.getRole()).getAuthorities());
        dto.setUserId(generateId());
        dto.setActif(true);
        dto.setNotLocked(true);
        dto.setJoinedDate(LocalDateTime.now());
        user=mapper.toEntity1(dto);
        user=userRepository.save(user);
        return mapper.toDto(user);
    }

    @Override
    public UtilisateurDTO updateUser(String currentUsername, UtilisateurDTO dto) throws UsernameExistException, EmailExistException {
        Utilisateur user=validateNewUsername(currentUsername,dto.getUsername());

        assert user!=null;
        user.setUsername(dto.getEmail());
        user.setEmail(dto.getEmail());
        user.setNotLocked(dto.isNotLocked());
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setRole(getRoleEnumName(dto.getRole()).name());
        log.info("Role: {}", getRoleEnumName(dto.getRole()).name());
        user.setAuthorities( getRoleEnumName(dto.getRole()).getAuthorities());
        user.setTelephone(dto.getTelephone());
        user.setCin(dto.getCin());
        user.setSexe(dto.getSexe());
        user.setDateNaissance(dto.getDateNaissance());
        user=userRepository.save(user);

        return mapper.toDto(user);
    }

    @Override
    public void lockedUser(String username)  {
        Utilisateur user=userRepository.findByUsername(username);
        if (user==null) {
            throw new UsernameNotFoundException(username);
        }
        user.setNotLocked(false);
    }

    @Override
    public void deleteUser(String username) throws IOException {
       /* if (!userRepository.existsByUsername(username)) {
            throw new UsernameNotFoundException(username);
        }
        userRepository.deleteByUsername(username);*/

    Utilisateur user = userRepository.findByUsername(username);
    if (user == null) {
        throw new UsernameNotFoundException("User not found: " + username);
    }
    userRepository.delete(user);
    }


    private Utilisateur validateNewUsername(String currentUsername, String newUsername) throws UsernameExistException, EmailExistException {
        Utilisateur userByNewUsername=findUserByUsername(newUsername);
        //Utilisateur userByNewEmail=findUserByEmail(newEmail);
        if (StringUtils.isNotBlank(currentUsername)) {
            Utilisateur currentUser=findUserByUsername(currentUsername);
            if (currentUser==null) {
                throw new UsernameNotFoundException("No user found by this email :"+currentUsername);
            }

            return currentUser;
        }else {
            if (userByNewUsername!=null ) {
                throw new UsernameExistException(USERNAME_ALREADY_EXIST);
            }
            return null;
        }
    }

    @Override
    public void resetPassword(String email) throws EmailNotFoundException, MessagingException {
            Utilisateur user = userRepository.findByEmail(email);

            if (user == null) {
                throw new EmailNotFoundException(USER_NOT_FOUND_BY_EMAIL+email);
            }
            String password=(generatePassword());
            user.setPassword(encodePassword(password));
            userRepository.save(user);
            log.info("New password: {}", password);
            emailService.sendNewPasswordEmail(user.getNom()+" "+user.getPrenom(),password,user.getUsername());
    }

    @Override
    public void changePassword(String email,String oldPassword , String newPassword) throws EmailNotFoundException, EmailException, EmailExistException, MessagingException {
        Utilisateur user = userRepository.findByEmail(email);

        if (user == null) {
            throw new EmailNotFoundException(USER_NOT_FOUND_BY_EMAIL+email);
        }
        if (passwordEncoder.matches(oldPassword,user.getPassword())) {

            if (passwordEncoder.matches(newPassword,user.getPassword())) {
                throw new IllegalArgumentException("Votre nouveau mot de passe doit être different de l'ancien");
            }
            user.setPassword(encodePassword(newPassword));
            userRepository.save(user);
            log.info("The password was changed, New password: {}", newPassword);
            emailService.sendNewPasswordEmail(user.getNom()+" "+user.getPrenom(),newPassword,user.getUsername());
        }
        else {
            throw new IllegalArgumentException("Votre ancien mot de passe saisi est incorrecte");
        }

    }


    private String generateId() {
        return RandomStringUtils.insecure().nextNumeric(10);
    }

    @Override
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private String generatePassword() {
        return RandomStringUtils.secure().nextAlphanumeric(15);
    }

    private Role getRoleEnumName(String role) {
        return Role.valueOf(role.toUpperCase());
    }
    @Override
    public Utilisateur findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
