package com.project.catchJob.security;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import org.springframework.stereotype.Component;

import com.project.catchJob.dto.member.MemberDTO;

@Component
public class PasswordEncoder {
	
	// https://wonchan.tistory.com/4참고
	
	private static final String SECRET_KEY_FACTORY_ALGORITHM = "PBKDF2WithHmacSHA1";
    private static final int ITERATION_COUNT = 321;
    private static final int KEY_LENGTH = 123;
	
	public String encrypt(String email, String pwd) {
		
		try {
			SecretKeyFactory factory = SecretKeyFactory.getInstance(SECRET_KEY_FACTORY_ALGORITHM);
			KeySpec spec = new PBEKeySpec(pwd.toCharArray(), getSalt(email), ITERATION_COUNT, KEY_LENGTH);
			
			byte[] hash = factory.generateSecret(spec).getEncoded();
			
			return Base64.getEncoder().encodeToString(hash);
		} catch (NoSuchAlgorithmException | UnsupportedEncodingException | InvalidKeySpecException e) {
			throw new RuntimeException(e);
		}
	}
	
	public byte[] getSalt(String email) throws NoSuchAlgorithmException, UnsupportedEncodingException {
			
			MessageDigest digest = MessageDigest.getInstance("SHA-512");
			byte[] keyBytes = email.getBytes("UTF-8");
			return digest.digest(keyBytes);
		}		
	
	public String encode(MemberDTO memberDTO) {
		PasswordEncoder pwdEncoder = new PasswordEncoder();
		String encryptPwd = pwdEncoder.encrypt(memberDTO.getEmail(), memberDTO.getPwd());
		
		return encryptPwd;
	}
	
	public boolean matches(String pwd1, String pwd2) {
	    return pwd1.equals(pwd2);
	}

}

