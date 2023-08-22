package com.project.catchJob.service;


import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.catchJob.domain.member.M_profile;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.member.GoogleUserInfoDTO;
import com.project.catchJob.dto.member.MemberDTO;
import com.project.catchJob.dto.member.MemberInfoDTO;
import com.project.catchJob.exception.UnauthorizedException;
import com.project.catchJob.repository.member.M_ProfileRepository;
import com.project.catchJob.repository.member.MemberRepository;
import com.project.catchJob.security.PasswordEncoder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional // memberRepo와 mProfileRepo 하나라도 실패하면 롤백
public class MemberService {
	
	@Autowired 
	private MemberRepository memberRepo;
	
	@Autowired
	private M_ProfileRepository mProfileRepo;
	
	@Autowired
	private PasswordEncoder pwdEncoder;

	@Autowired
	private CommonService commonService;
	
	@Autowired
	private BoardService boardService;
	
	@Value("${file.path}") private String filePath;
	@Value("${front.file.path}") private String frontFilePath;
	
	// 회원가입
	public Member createMember(MemberDTO memberDTO) throws Exception {
		
		final String email = memberDTO.getEmail();
		if(memberRepo.existsByEmail(email)) {
			log.warn("{} 해당 이메일은 이미 존재합니다!", email);
			throw new RuntimeException("이미 존재하는 이메일입니다!");
		}

		String defaultProfile = frontFilePath + "profile.png";
		
		Member member = Member.builder()
				.email(memberDTO.getEmail())
				.name(memberDTO.getName())
				.pwd(pwdEncoder.encrypt(memberDTO.getEmail(), memberDTO.getPwd()))
				.job(memberDTO.getJob())
				.hasCareer(memberDTO.getHasCareer())
				.type("일반")
				.fileAttached(0) // 회원가입 시 미첨부0 고정
				.build();
		
		member.createDefaultProfile(defaultProfile);
		return memberRepo.save(member);
	}
	
	// 구글 로그인 (구현 중)
	public Member signInOrSignUpWithGoogle(GoogleUserInfoDTO googleDTO) {
	    String email = googleDTO.getEmail();

	    if (email == null) {
	        log.error("Email field in GoogleUserInfoDTO is null");
	        throw new IllegalArgumentException("Email cannot be null");
	    }

	    if (memberRepo.existsByEmail(email)) {
	        // 이미 존재하는 사용자인 경우 로그인 처리를 수행합니다.
	        Member existingMember = memberRepo.findByEmail(email);
	        String existedEmail = existingMember.getEmail();
	        String existedPwd = existingMember.getPwd();
	        System.out.println("-------" + existedEmail);
	        System.out.println("-------" + existedPwd);
	        return getByCredentials(existedEmail, existedPwd, pwdEncoder);
	        
//	        log.info("Existing user with email {} logged in", email);
//	        return existingMember;
	    } else {
	        // 새로운 사용자인 경우 회원 가입 처리 및 데이터베이스에 저장합니다.
	        Member newMember = createGoogleMember(googleDTO);
	        Member savedMember = memberRepo.save(newMember);
	        log.info("New user with email {} registered and logged in", email);
	        return getByCredentials(savedMember.getEmail(), savedMember.getPwd(), pwdEncoder);
	        
//	        return savedMember;
	    }
	}
	
	// 구글로그인 회원가입 (구현 중)
	public Member createGoogleMember(GoogleUserInfoDTO googleDTO) {
	    if (googleDTO == null) {
	        log.error("GoogleUserInfoDTO is null");
	        throw new IllegalArgumentException("GoogleUserInfoDTO cannot be null");
	    }
	    
	    final String email = googleDTO.getEmail();
	    if (email == null) {
	        log.error("Email field in GoogleUserInfoDTO is null");
	        throw new IllegalArgumentException("Email cannot be null");
	    }
	    
	    if (memberRepo.existsByEmail(email)) {
	        log.warn("{} 해당 이메일은 이미 존재합니다!", email);
	        throw new RuntimeException("이미 존재하는 이메일입니다!");
	    }
	    
	    String id = googleDTO.getId();
	    String picture = googleDTO.getPicture();
	    
	    M_profile profile = M_profile.builder()
	            .mOriginalFileName(picture)
	            .mStoredFileName(picture)
	            .build();

	    Member member = Member.builder()
	            .email(googleDTO.getEmail())
	            .name(googleDTO.getName())
	            .pwd(pwdEncoder.encrypt(googleDTO.getEmail(), id))
	            .job("기타")
	            .hasCareer("신입")
	            .type("구글")
	            .fileAttached(1)
	            .mProfile(profile)
	            .build();
	    
	    profile.setMember(member);
	    member.setMProfile(profile);
	    
	    return member;
	}

	// 로그인
	public Member getByCredentials(final String email, final String pwd, final PasswordEncoder pwdEncoder) {
		
		final Member originMember = memberRepo.findByEmail(email);
		// log.info("데이터베이스에서 조회한 멤버: {}", originMember);
		// matches 메서드를 이용해서 패스워드 같은지 확인
		if(originMember != null && pwdEncoder.matches(pwdEncoder.encrypt(email, pwd), originMember.getPwd())) {
			return originMember;
		}
		return null;
	}
	
	// 마이페이지(1. 회원조회)
	public MemberInfoDTO getInfo(String jwtToken) {
		
		 Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
		    		.orElseThrow(UnauthorizedException::new);
		
		Member findMember = memberRepo.findByEmail(optAuthenticatedMember.getEmail());
		String mOriginalFileName = findMember.getMProfile().getMStoredFileName();
		MemberInfoDTO memberInfo = MemberInfoDTO.builder()
				.email(findMember.getEmail())
				.name(findMember.getName())
				.job(findMember.getJob())
				.hasCareer(findMember.getHasCareer())
				.mOriginalFileName(frontFilePath + mOriginalFileName)
				.build();
		return memberInfo;
	}
	
	// 마이페이지(2. 비번조회)
	public String checkPwd(String jwtToken, MemberDTO memberDTO, PasswordEncoder pwdEncoder) {
		
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
	    		.orElseThrow(UnauthorizedException::new);
		if(optAuthenticatedMember != null && pwdEncoder.matches(
				pwdEncoder.encrypt(optAuthenticatedMember.getEmail(), memberDTO.getPwd()), 
				optAuthenticatedMember.getPwd())) {
			return "비밀번호 일치";
		}
		return null;
	}
	
	// 마이페이지(3. 회원수정)
	public MemberDTO updateMember(String jwtToken, String name, String pwd, String job, String hasCareer, MultipartFile mFile) throws Exception {
		
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		
		if(optAuthenticatedMember != null) {
			optAuthenticatedMember.setName(name);
			optAuthenticatedMember.setPwd(pwdEncoder.encrypt(optAuthenticatedMember.getEmail(), pwd));
			optAuthenticatedMember.setJob(job);
			optAuthenticatedMember.setHasCareer(hasCareer);
			
			if(mFile != null) {
				optAuthenticatedMember.setFileAttached(1);
				
				String originalFileName = mFile.getOriginalFilename();
				String storedFileName = UUID.randomUUID() + originalFileName;
				String savePath = filePath + storedFileName;
				
				// 기존 프로필 사진 삭제
				M_profile currentProfile = optAuthenticatedMember.getMProfile();
				String exOriginProfile = currentProfile.getMOriginalFileName();
				String exStoredProfile = currentProfile.getMStoredFileName();
				if(!exOriginProfile.equals("profile.png") && !exStoredProfile.equals("profile.png")) {
					File exProfileFile = new File(filePath + currentProfile.getMStoredFileName());
					if(exProfileFile.exists()) {
						exProfileFile.delete();
					}
				}
				
				mFile.transferTo(new File(savePath));
				
				// 기존 M_profile 객체 수정
				currentProfile.setMOriginalFileName(originalFileName);
				currentProfile.setMStoredFileName(storedFileName);
				mProfileRepo.save(currentProfile);
			}
			Member updateMember = memberRepo.save(optAuthenticatedMember);
			return MemberDTO.toMemberDTO(updateMember, frontFilePath);
		} else {
			throw new RuntimeException("다시 로그인 해주세요");
		}
	}
	
	// 회원 정보 조회
	public Member getMember(Long memberId) throws Exception {
        return memberRepo.findById(memberId)
                .orElseThrow(() -> new Exception("해당 회원이 없습니다"));
    }
	
	// 회원 탈퇴
	public void deleteMember(String jwtToken) {
		
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		String defaultProfile = "profile.png";
		String originFile = optAuthenticatedMember.getMProfile().getMOriginalFileName();
		String storedFile = optAuthenticatedMember.getMProfile().getMStoredFileName();
		
		if(!originFile.equals(defaultProfile) && !storedFile.equals(defaultProfile)) {
			
			boardService.deleteFile(storedFile);
		}
		
		memberRepo.deleteById(optAuthenticatedMember.getMemberId());
	}

}