package com.emma.pfe.filtre;

import com.emma.pfe.utility.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static com.emma.pfe.constantes.SecurityConstant.*;
@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private static final int MAX_JWT_LENGTH = 2048;
    private final JwtTokenProvider tokenProvider;

    public JwtAuthFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @Nonnull HttpServletResponse response,
                                    @Nonnull FilterChain filterChain)
            throws ServletException, IOException {

        if (request.getMethod().equalsIgnoreCase(HttpMethod.OPTIONS.name())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(TOKEN_PREFIX.length());
            if (token.length() > MAX_JWT_LENGTH) {
                throw new JwtException("Token trop long");
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                String username = tokenProvider.extractUsername(token);

                // Validation renforcée
                if (StringUtils.hasText(username)) {
                    Claims claims = tokenProvider.extractAllClaims(token); // Récupère directement les claims

                    // Vérification manuelle des types
                    Object isValidClaim = claims.get("isValid"); // Remplacez par votre claim problématique
                    boolean isValid = false;

                    if (isValidClaim instanceof Boolean) {
                        isValid = (Boolean) isValidClaim;
                    } else if (isValidClaim instanceof String) {
                        isValid = Boolean.parseBoolean((String) isValidClaim);
                    }

                    if (isValid && tokenProvider.isTokenValid(username, token)) {
                        List<GrantedAuthority> authorities = tokenProvider.getAuthorities(token);
                        Authentication auth = tokenProvider.getAuthentication(username, authorities, request);
                        log.info("AUTHORITIES: {}", auth.getAuthorities());
                        log.info("Auth user: {}", auth.getName());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        logger.debug("Authentifié l'utilisateur: {}", username);
                    }
                }
            }
        } catch (JwtException | ClassCastException e) {
            logger.error("Échec de l'authentification JWT: {}", e.getMessage());
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Format de token invalide");
            return;
        }

        filterChain.doFilter(request, response);
    }
}