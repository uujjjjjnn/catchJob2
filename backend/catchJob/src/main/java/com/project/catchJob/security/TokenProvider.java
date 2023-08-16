package com.project.catchJob.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.catchJob.domain.member.Member;
import com.project.catchJob.repository.member.MemberRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenProvider {
	
	private String SECRET_KEY = "catchJobSecretKeycatchJobSecretKeycatchJobSecretKeycatchJobSecretKeycatchJobSecretKey";
	
	@Autowired
	private MemberRepository memberRepository;
	
	@PostConstruct
	protected void init() {
		SECRET_KEY = Base64.getEncoder().encodeToString(SECRET_KEY.getBytes());
	}
	
	// 로그인 시 토큰 생성
	public String createToken(Member member) {
		Date expireDate = Date.from(
			Instant.now()
				.plus(1, ChronoUnit.DAYS));
//		Claims claims = Jwts.claims().setSubject(member.getEmail());
		
		Claims claims = Jwts.claims()
	            .setSubject(member.getEmail())
	            .setIssuer("Token by catchJob")
	            .setIssuedAt(new Date())
	            .setExpiration(expireDate);

	    return Jwts.builder()
	            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
	            .setClaims(claims)
	            .compact();
		
	}
	
	// JWT 토큰에서 인증 정보 조회
	public String getUserEmail(String token) {
		return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody().getSubject();
	}
	
	// Request의 Header에서 token 값 가져오기 "Authorization" : "TOKEN값"
	public String resolveToken(HttpServletRequest request) {
		return request.getHeader("Authorization");
	}
	
	// 토큰의 유효성/만료일자 확인
	public boolean validateToken(String token) {
		try {
			Jws<Claims> claimsJws = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
			return !claimsJws.getBody().getExpiration().before(new Date());
		} catch (Exception e) {
			return false;
		}
	}

}
