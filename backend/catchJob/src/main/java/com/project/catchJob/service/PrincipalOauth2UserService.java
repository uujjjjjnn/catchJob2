package com.project.catchJob.service;

//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class PrincipalOauth2UserService {/*extends DefaultOAuth2UserService {

	@Autowired
	private MemberRepository memberRepo;
	
	@Autowired
	private PasswordEncoder pwdEncoder;
	
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

		OAuth2User oAuth2User = super.loadUser(userRequest);
		
		String provider = userRequest.getClientRegistration().getRegistrationId(); // 구글id
		String providerId = oAuth2User.getAttribute("sub");
		
		String gEmail = oAuth2User.getAttribute("email");
		String gName = oAuth2User.getAttribute("name");
		String gPicture = oAuth2User.getAttribute("picture");
		String gPwd = pwdEncoder.encrypt(gEmail, providerId); // 임의로 비번 생성
		
		Member findMember = memberRepo.findByEmail(gEmail);
		// DB에 없는 사용자라면 회원가입
		if(findMember == null) {
			findMember = Member.builder()
					.type("구글")
					.email(gEmail)
					.name(gName)
					.pwd(gPwd)
					.job("기타")
					.hasCareer("신입")
					.build();
			memberRepo.save(findMember);
		}
		return new PrincipalDetails(findMember, oAuth2User.getAttributes());
		//return null;
	}
*/
}
