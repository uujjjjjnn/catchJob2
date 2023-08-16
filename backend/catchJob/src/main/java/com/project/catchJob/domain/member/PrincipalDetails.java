package com.project.catchJob.domain.member;

/*
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
*/
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class PrincipalDetails {//implements UserDetails, OAuth2User { 
/*
	// 일반회원로그인과 소셜로그인 방법 구분없이 한 객체로 관리하기위해
	// PrincipalDetails에 OAuth2User도 implements
	
	private Member member;
	private Map<String, Object> attributes;
	
	// UserDetails : 일반회원 로그인
	public PrincipalDetails(Member member) {
		this.member = member;
	}
	
	// OAuth2User : 소셜로그인
	public PrincipalDetails(Member member, Map<String, Object> attributes) {
		this.member = member;
		this.attributes = attributes;
	}

	
	// OAuth2User
	@Override
	public String getName() {
		String sub = attributes.get("sub").toString();
		return sub;
	}

	// UserDetails 권한 부분은 따로 설정하지 않아서 사용 안 함
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	// UserDetails 비밀번호
	@Override
	public String getPassword() {
		return member.getPwd();
	}

	// UserDetails PK값 반환(email로 식별할꺼라 email넣어줌)
	@Override
	public String getUsername() {
		return member.getEmail();
	}

	// UserDetails 계정 만료 여부 (t-만료x/f-만료)
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	// UserDetails 계정 잠김 여부 (t-잠김x/f-잠김)
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	// UserDetails 계정 비밀번호 만료 여부 (t-만료x/f-만료)
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	// UserDetails - 계정활성화여부(t-활성화/f-비활성화)
	@Override
	public boolean isEnabled() {
		return true;
	}
*/
}
