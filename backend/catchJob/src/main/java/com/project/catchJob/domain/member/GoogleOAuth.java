package com.project.catchJob.domain.member;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.catchJob.config.RestTemplateConfig;
import com.project.catchJob.dto.member.GoogleOAuthTokenDTO;
import com.project.catchJob.dto.member.GoogleUserInfoDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@PropertySource("classpath:application-oauth.properties")
public class GoogleOAuth {

	// https://velog.io/@hwsa1004/Spring-%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-REST-API-%EA%B5%AC%ED%98%84-OAuth2
	// https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko 참고
	
	private final String GOOGLE_LOGIN_URL = "https://accounts.google.com";
			
	private final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
	
	private final String GOOGLE_USERINFO_REQUEST_URL = "https://www.googleapis.com/oauth2/v1/userinfo";
	
	private final ObjectMapper objectMapper;
	
	private final RestTemplate restTemplate;
	
	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	private String googleClientId;
	
	@Value("${spring.security.oauth2.client.registration.google.client-secret}")
	private String googleClientSecret;
	
	@Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
	private String googleRedirectUrl;


//	public String getOauthRedirectURL() {
//
//		String redirectUrl = "https://accounts.google.com/o/oauth2/auth";
////	    String clientId = googleClientId;
////	    String redirectUri = googleRedirectUrl;
//	    String responseType = "code";
//	    String scope = "openid email profile";
//	    String state = "your-state-value"; // 선택 사항: CSRF 보호를 위한 상태 값 추가
//	    
//	    String oauthUrl = redirectUrl + "?client_id=" + clientId + "&redirect_uri=" + redirectUri +
//	            "&response_type=" + responseType + "&scope=" + scope + "&state=" + state;
//	    
//	    return oauthUrl;
//	}

	// 일회용 코드를 다시 구글로 보내 엑세스 토큰을 포함한 json string이 담긴 responseEntity 받아옴
//	public ResponseEntity<String> requestAccessToken(String accessCode) {
//		RestTemplate restTemplate = new RestTemplate();
//		Map<String, String> params = new HashMap<>();
//		
//		params.put("code", accessCode);
//		params.put("client_id", googleClientId);
//		params.put("client_secret", googleClientSecret);
//		params.put("redirect_uri", googleRedirectUrl);
//		params.put("grant_type", "authorization_code");
//		
//		
//		ResponseEntity<String> responseEntity = restTemplate.postForEntity(GOOGLE_TOKEN_URL, params, String.class);
//		if(responseEntity.getBody().isBlank() || responseEntity.getBody().isEmpty()) System.out.println("res~~~~~~~~~~" + "없" );
//		System.out.println("getStatusCode~~~~~~~" + responseEntity.getStatusCode());
//		System.out.println("getBody~~~~~~~" + responseEntity.getBody());
//		
//		if(responseEntity.getStatusCode() == HttpStatus.OK) {
//			ResponseEntity.ok(responseEntity);
//		}
//		return ResponseEntity.badRequest().body("fail");
		

	public ResponseEntity<String> requestAccessToken(String accessCode) {
		System.out.println("=======3========" + accessCode);
		RestTemplate restTemplate = new RestTemplate();
		Map<String, String> params = new HashMap<>();

		params.put("code", accessCode);
		params.put("client_secret", googleClientSecret);
		params.put("grant_type", "authorization_code");
		params.put("client_id", googleClientId);
		params.put("redirect_uri", googleRedirectUrl);

		ResponseEntity<String> responseEntity = restTemplate.postForEntity(GOOGLE_TOKEN_URL, params, String.class);
		// 스프링부트에서 다른 서버의 api 엔드포인트 호출할 때 restTemplate사용
		System.out.printf("여기니?");
		if(responseEntity.getStatusCode() == HttpStatus.OK) {
		System.out.println("=======ok========" + responseEntity);
		return responseEntity;
		}
		System.out.println("=======null========" + responseEntity);
		return ResponseEntity.badRequest().body("fail");
	}

	
	// token 얻기 json -> 자바 객체
	public GoogleOAuthTokenDTO getAccessToken(ResponseEntity<String> res) throws JsonProcessingException {
		GoogleOAuthTokenDTO googleOAuthTokenDTO = objectMapper.readValue(res.getBody(), GoogleOAuthTokenDTO.class);
		return googleOAuthTokenDTO;
		// GoogleOAuthTokenDTO : json형태를 자바 객체 형식으로 변경 후 저장해서 담을 곳
	}

	// get으로 token받아와서 사용자 정보 요청
	public ResponseEntity<String> requestUserInfo(GoogleOAuthTokenDTO oAuthToken) {
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + oAuthToken.getAccess_token());
		
		HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(headers);
//		HttpEntity req = new HttpEntity(headers);
		ResponseEntity<String> res = restTemplate.exchange(GOOGLE_USERINFO_REQUEST_URL, HttpMethod.GET, req, String.class);
		return res;
	}
	
	// 요청해서 받은 사용자 정보 json -> 자바 객체
	public GoogleUserInfoDTO getUserInfo(ResponseEntity<String> res) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		GoogleUserInfoDTO googleUserInfoDTO = objectMapper.readValue(res.getBody(), GoogleUserInfoDTO.class);
		System.out.println("================" + googleUserInfoDTO);
		return googleUserInfoDTO;
		// GoogleUserInfoDTO : json형태를 자바 객체 형식으로 변경 후 저장해서 담을 곳
	}
	
}