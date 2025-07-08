package com.emma.pfe.utility;

import com.emma.pfe.domain.UserPrincipal;
import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.emma.pfe.constantes.SecurityConstant.*;
@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);
    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;
    private final String issuer;
    private final long expirationTime;

    @Autowired
    public JwtTokenProvider(@Value("${jwt.issuer}") String issuer,
                            @Value("${jwt.expiration}") long expirationTime) {
        this.privateKey = JwtKeyProvider.getPrivateKey();
        this.publicKey = JwtKeyProvider.getPublicKey();
        this.issuer = issuer;
        this.expirationTime = expirationTime;
    }

    public String generateToken(UserPrincipal userPrincipal) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(AUTHORITIES, getClaimsFromUser(userPrincipal));

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claims(claims)
                .issuer(issuer)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(privateKey, Jwts.SIG.RS512)
                .compact();
    }

    //@Cacheable(value = "jwtClaims", key = "#token")
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            logger.warn("Token expiré: {}", e.getMessage());
            throw new JwtException("Token expiré", e);
        } catch (MalformedJwtException e) {
            logger.warn("Token malformé: {}", e.getMessage());
            throw new JwtException("Token malformé", e);
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("Token invalide: {}", e.getMessage());
            throw new JwtException("Token invalide", e);
        }
    }
    @Cacheable(value = "jwtClaims", key = "#token")
    public List<GrantedAuthority> getAuthorities(String token) {
        return ((List<?>) extractAllClaims(token).get(AUTHORITIES))
                .stream()
                .map(authority -> new SimpleGrantedAuthority((String) authority))
                .collect(Collectors.toList());
    }
    @Cacheable(value = "jwtClaims", key = "#token")
    public Authentication getAuthentication(String username,
                                            List<GrantedAuthority> authorities,
                                            HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(username, null, authorities);
        logger.info("Authorities: {}", authorities);
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return authToken;
    }
    
    public boolean isTokenValid(String username, String token) {
        try {
            Claims claims = this.extractAllClaims(token); // Contourne le cache
            return username.equals(claims.getSubject())
                    && !isTokenExpired(token)
                    && issuer.equals(claims.getIssuer());
        } catch (Exception e) {
            return false;
        }
    }


    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
    @Cacheable(value = "jwtClaims", key = "#token")
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }


    private List<String> getClaimsFromUser(UserPrincipal userPrincipal) {
        return userPrincipal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

}