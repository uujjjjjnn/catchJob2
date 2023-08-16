package com.project.catchJob.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.servlet.http.HttpServletRequest;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.algorithm}")
    private String jwtAlgorithm;

//    public Claims getClaimsFromToken(String token) {
//        try {
//            return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
//        } catch (SignatureException e) {
//            return null;
//        }
//    }
    
    private SignatureAlgorithm getSignatureAlgorithm() {
        return SignatureAlgorithm.forName(jwtAlgorithm);
    }
    
    public Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(createSecretKey()) // 새롭게 생성한 시크릿 키 메서드 사용
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            return null;
        }
    }

    public String getEmailFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        Claims claims = getClaimsFromToken(token);
        if (claims != null) {
            return claims.get("email", String.class);
        } else {
            // claims가 null인 경우, null 또는 기본값을 반환하세요.
            return null;
        }
    }
    
    public SecretKey createSecretKey() {
        return Keys.secretKeyFor(getSignatureAlgorithm());
    }
    
    
    
    

}
