package com.project.catchJob.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.catchJob.domain.member.GoogleOAuth;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.member.GoogleOAuthTokenDTO;
import com.project.catchJob.dto.member.GoogleUserInfoDTO;
import com.project.catchJob.dto.member.MemberDTO;

@Service
public class OAuthService {
	
	@Autowired
	private GoogleOAuth googleOauth;
	
	@Autowired
	private MemberService memberService;
	
	private MemberDTO getGoogleUserInfoDTO(String code) throws JsonProcessingException {
		
		ResponseEntity<String> accessTokenResponse = googleOauth.requestAccessToken(code);
		GoogleOAuthTokenDTO oAuthToken = googleOauth.getAccessToken(accessTokenResponse);
		ResponseEntity<String> userInfoRes = googleOauth.requestUserInfo(oAuthToken);
		GoogleUserInfoDTO googleUser = googleOauth.getUserInfo(userInfoRes);
		MemberDTO member = memberService.signInOrSignUpWithGoogle(googleUser);
		return member;
	}
	
}