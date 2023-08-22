package com.project.catchJob.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.catchJob.domain.member.GoogleOAuth;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.member.GoogleOAuthTokenDTO;
import com.project.catchJob.dto.member.GoogleUserInfoDTO;
import com.project.catchJob.dto.member.MemberDTO;
import com.project.catchJob.dto.member.MemberInfoDTO;
import com.project.catchJob.security.PasswordEncoder;
import com.project.catchJob.security.TokenProvider;
import com.project.catchJob.service.BoardService;
import com.project.catchJob.service.MemberService;
import com.project.catchJob.service.OAuthService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class MemberController {

	@Autowired
	private MemberService memberService;
	
	@Autowired
	private TokenProvider tokenProvider;
	
	@Autowired
	private PasswordEncoder pwdEncoder;
	
	@Autowired
	private GoogleOAuth googleoauth;
	
	@Autowired
	private OAuthService oAuthService;
	
	@Value("${front.file.path}")
	private String frontFilePath;
	
	
	// 회원등록
	@PostMapping("/register")
	public ResponseEntity<?> registerMember(@RequestBody MemberDTO memberDTO) {
		try {
			if(memberDTO == null || memberDTO.getPwd() == null) {
				throw new RuntimeException("비밀번호 공란");
			}

			Member responseMember = memberService.createMember(memberDTO);
			return ResponseEntity.ok().body(responseMember);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("해당 이메일은 이미 존재합니다. 다른 이메일을 입력해주세요.");
		}		
	}
	
	// 로그인
	@PostMapping("/login") 
	public ResponseEntity<?> login(@RequestBody MemberDTO memberDTO) {
		log.info("로그인 요청: 이메일 = {}, 비밀번호 = {}", memberDTO.getEmail(), memberDTO.getPwd());
		
		Member member = memberService.getByCredentials(memberDTO.getEmail(), memberDTO.getPwd(), pwdEncoder);
		
		// log.info("{} 로그인 성공", member.toString());
		if(member != null) {
			log.info("인증 성공. 이메일 = {}, 이름 = {}", member.getEmail(), member.getName());
			// 토큰 생성
			final String token = tokenProvider.createToken(member);
			log.info("token 생성 성공", token);
			
			String profile;
			if(member.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
				profile = member.getMProfile().getMStoredFileName();
			} else {
				profile = frontFilePath + member.getMProfile().getMStoredFileName();
			}
			
//			String profile = "https://main--classy-kleicha-484f07.netlify.app/.netlify/functions/proxy/upload/" + member.getMProfile().getMStoredFileName();
//			String profile = "https://43.202.98.45:8089/upload/" + member.getMProfile().getMStoredFileName();
			
			final MemberDTO responseMemberDTO = MemberDTO.builder()
					.memberId(member.getMemberId())
					.name(member.getName())
					.email(member.getEmail())
					.pwd(pwdEncoder.encrypt(member.getEmail(), member.getPwd()))
					.job(member.getJob())
					.hasCareer(member.getHasCareer())
					.mOriginalFileName(profile)
					.token(token)
					.build();
			
			return ResponseEntity.ok().body(responseMemberDTO);
		}
		else {
			log.error("인증 실패");
			return ResponseEntity.badRequest().body("로그인 실패");
		}
	}
	
//	// 구글 로그인
//	@PostMapping("/login/oauth2/code/google")
	@PostMapping("/googlelogin")
	public ResponseEntity<?> successGoogleLogin(@RequestParam("code") String code) {
		ResponseEntity<String> accessTokenResponse;
	    try {
	        accessTokenResponse = googleoauth.requestAccessToken(code);
	        GoogleOAuthTokenDTO oAuthToken = googleoauth.getAccessToken(accessTokenResponse);
	        ResponseEntity<String> userInfoRes = googleoauth.requestUserInfo(oAuthToken);
	        GoogleUserInfoDTO googleUser = googleoauth.getUserInfo(userInfoRes);
	        MemberDTO savedMember = memberService.signInOrSignUpWithGoogle(googleUser);
//	        Member savedMember = memberService.createGoogleMember(googleUser);
	        
	        return ResponseEntity.ok().body("================" + savedMember);
	        
	    } catch (JsonProcessingException e) {
	        e.printStackTrace();
	        return ResponseEntity.badRequest().body("Google Login Failed");
	    }
	}

	// 마이페이지 (회원조회)
	@GetMapping("/memberInfo")
	public ResponseEntity<?> memberInfo(@RequestHeader("Authorization") String jwtToken) {
		
		MemberInfoDTO memberInfo = memberService.getInfo(jwtToken);
		if(memberInfo != null) {
			return ResponseEntity.ok().body(memberInfo);
		}
		return ResponseEntity.badRequest().body("회원 조회 실패");
	}
	
	// 마이페이지 (비번조회)
	@PostMapping("/memberPwd")
	public ResponseEntity<?> checkPwd(@RequestHeader("Authorization") String jwtToken, @RequestBody MemberDTO memberDTO) {
		
		String res = memberService.checkPwd(jwtToken, memberDTO, pwdEncoder);
		if(res != null) {
			return ResponseEntity.ok().body("비밀번호 일치");
		} 
		return ResponseEntity.badRequest().body("비밀번호 불일치");
	}
	
	// 마이페이지 (회원수정)
	@PostMapping(value = "/memberUpdate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> memberUpdate(@RequestHeader("Authorization") String jwtToken,
			@RequestParam(value = "name") String name,
			@RequestParam(value = "pwd") String pwd,
			@RequestParam(value = "job") String job,
			@RequestParam(value = "hasCareer") String hasCareer,
			@RequestPart(value = "mOriginalFileName", required = false) MultipartFile mFile) throws Exception {
		
		MemberDTO updateMemberDTO = memberService.updateMember(jwtToken, name, pwd, job, hasCareer, mFile);
		
		if(updateMemberDTO != null) {
			return ResponseEntity.ok().body(updateMemberDTO);
		} 
		return ResponseEntity.badRequest().body("회원 수정 실패");
	}
	
	// 회원 탈퇴
	@DeleteMapping("/deleteMember")
	public ResponseEntity<?> deleteMember(@RequestHeader("Authorization") String jwtToken) {
		
		memberService.deleteMember(jwtToken);
		return ResponseEntity.ok().body("회원 탈퇴 성공");
	}
}