package com.emma.pfe.controller;

import com.emma.pfe.domain.HttpResponse;
import com.emma.pfe.domain.UserPrincipal;
import com.emma.pfe.domain.Utilisateur;
import com.emma.pfe.domain.dto.UtilisateurDTO;
import com.emma.pfe.exceptions.EmailException;
import com.emma.pfe.exceptions.domain.EmailExistException;
import com.emma.pfe.exceptions.domain.EmailNotFoundException;
import com.emma.pfe.exceptions.domain.ExceptionHandling;
import com.emma.pfe.exceptions.domain.UsernameExistException;
import com.emma.pfe.service.UserService;
import com.emma.pfe.utility.JwtTokenProvider;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.emma.pfe.constantes.SecurityConstant.JWT_TOKEN_HEADER;
import static com.emma.pfe.constantes.SecurityConstant.TOKEN_PREFIX;
import static org.springframework.http.HttpStatus.OK;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController extends ExceptionHandling {
    private static final String EMAIL_SENT = "Un email contenant le nouveau mot de passe, vous a été envoyé ";
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Utilisateur user) {
        //log.info("Password {} logged in", userService.encodePassword(user.getPassword()));
        // 1. Authentification
        authenticate(user.getUsername(), user.getPassword());


        // 2. Récupération de l'utilisateur
        Utilisateur loginUser = userService.findUserByUsername(user.getUsername());
        UserPrincipal userPrincipal = new UserPrincipal(loginUser);

        // 3. Génération des headers JWT
        HttpHeaders jwtHeaders = getJwtHeader(userPrincipal);

        // 4. Construction de la réponse
        Map<String, Object> response = new HashMap<>();
        response.put("user", loginUser);
        response.put(JWT_TOKEN_HEADER,jwtHeaders.getFirst(JWT_TOKEN_HEADER)); // Ajout explicite du token

        return new ResponseEntity<>(response, jwtHeaders, HttpStatus.OK);
    }

    @GetMapping("/liste")
    public ResponseEntity<List<UtilisateurDTO>> listeUser () throws InterruptedException {
        //TimeUnit.SECONDS.sleep(3);
        List<UtilisateurDTO> users = userService.getAllUsers();
        return new ResponseEntity<>(users,OK);
    }

    @GetMapping("/get/{username}")
    public ResponseEntity<UtilisateurDTO> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userService.getOne(username));
    }

    @PostMapping("/register")
    public ResponseEntity<UtilisateurDTO> registerUser (@Valid @RequestBody UtilisateurDTO utilisateurDTO) throws EmailExistException, MessagingException, EmailException, UsernameExistException {
        return ResponseEntity.ok(userService.register(utilisateurDTO));
    }


    @PostMapping("/ajouter")
    public ResponseEntity<UtilisateurDTO> addUser (@Valid @RequestBody UtilisateurDTO utilisateur) throws UsernameExistException, EmailExistException, MessagingException, EmailException, IOException {
        UtilisateurDTO newUser=userService.addUser(utilisateur);
        return new ResponseEntity<>(newUser, HttpStatus.OK);
    }

    @PutMapping("/update/{currentEmail}")
    public ResponseEntity<UtilisateurDTO> updateUser(@PathVariable("currentEmail") String currentEmail, @Valid @RequestBody UtilisateurDTO dto) throws EmailExistException, UsernameExistException, MessagingException, EmailException {
        UtilisateurDTO updateUser= userService.updateUser(currentEmail, dto);
        return new ResponseEntity<>(updateUser, HttpStatus.OK);
    }



    @PutMapping("/locked/{username}")
    public ResponseEntity<HttpResponse> BloquerUser(@PathVariable("username")String username) throws IOException {
        userService.lockedUser(username);
        return response(HttpStatus.OK, "User blocked successfully");
    }
    @DeleteMapping("/delete/{username}")
    //@PreAuthorize("hasAnyAuthority('user:delete')")
    public ResponseEntity<HttpResponse> deleteUser(@PathVariable("username")String username) throws IOException {
        userService.deleteUser(username);
        return response(HttpStatus.OK, "User deleted successfully");
    }

    @GetMapping("/resetPassword/{email}")
    public ResponseEntity<HttpResponse> resetPassword(@PathVariable("email") String email) throws EmailNotFoundException, EmailException, MessagingException {
        userService.resetPassword(email);
        return response(OK, EMAIL_SENT + email);
    }

    @PostMapping("/changePassword/{username}")
    public ResponseEntity<HttpResponse> changePassword(@PathVariable("username") String username, String oldPassword, String password) throws EmailNotFoundException, EmailExistException, MessagingException, EmailException {
        userService.changePassword(username,oldPassword,password);
        return response(OK,EMAIL_SENT + username);
    }



    @GetMapping("/find/{username}")
    public ResponseEntity<Utilisateur> findUserByUsername(@PathVariable("username") String username) {
        Utilisateur user = userService.findUserByUsername(username);
        return new ResponseEntity<>(user, OK);
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        HttpResponse body=new HttpResponse(httpStatus.value()
                ,httpStatus
                ,httpStatus.getReasonPhrase().toUpperCase()
                ,message.toUpperCase()
        );
        return new ResponseEntity<>(body,httpStatus);
    }

    private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
        HttpHeaders headers = new HttpHeaders();
        String token = jwtTokenProvider.generateToken(userPrincipal);
        headers.add(JWT_TOKEN_HEADER, token);
        headers.add(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + token);
        return headers;
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
    }


}
