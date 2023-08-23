package com.project.catchJob.dto.member;


import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.catchJob.domain.member.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor // 모든 필드를 매개변수로 하는 생성자
@NoArgsConstructor // 기본생성자
public class MemberDTO {
	
	private Long memberId;
	private String name;
	private String email;
	private String pwd;
	private String job;
	private String hasCareer;
	private String token;
	private String type;
	private String state;
	
	private MultipartFile mProfile;
	@JsonProperty("mOriginalFileName")
	private String mOriginalFileName;
	@JsonProperty("mStoredFileName")
	private String mStoredFileName;
	private int fileAttached;
	
	public int setFileAttached(int num) {
		return num;
	}
	
	public static MemberDTO toMemberDTO(Member member, String frontFilePath) {
		
		if(member == null) {
			throw new IllegalArgumentException("member가 null값");
		}
		
//		String url = "https://main--classy-kleicha-484f07.netlify.app/.netlify/functions/proxy/upload/";
//		String url = "http://43.202.98.45:8089/upload/";
//		String url = "https://43.202.98.45:8089/upload/";
		
		String fileUrl;
		if(member.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
			fileUrl = member.getMProfile().getMStoredFileName();
		} else {
			fileUrl = frontFilePath + member.getMProfile().getMStoredFileName();
		}
		
		MemberDTO memberDTO = new MemberDTO();
		memberDTO.setMemberId(member.getMemberId());
		memberDTO.setName(member.getName());
		memberDTO.setEmail(member.getEmail());
//		memberDTO.setPwd(pwdEncoder.encrypt(memberDTO.getEmail(), memberDTO.getPwd()));
		memberDTO.setPwd(member.getPwd());
		memberDTO.setJob(member.getJob());
		memberDTO.setHasCareer(member.getHasCareer());
		memberDTO.setType("일반");
		memberDTO.setMOriginalFileName(fileUrl);
		if(member.getFileAttached() == 0) {
			// 프로필 사진 없는 경우
			memberDTO.setFileAttached(member.getFileAttached());
		} else {
			// 프로필 사진 있는 경우
			memberDTO.setFileAttached(member.getFileAttached());
			// select * from member m, m_profile mp where m.member_id=mp.member_id where m.member_id=?
//			memberDTO.setMOriginalFileName(url + member.getMProfile().getMOriginalFileName());
//			memberDTO.setMOriginalFileName(url + member.getMProfile().getMStoredFileName());
//			memberDTO.setMStoredFileName(url + member.getMProfile().getMStoredFileName());
		}
		return memberDTO;
	}
	
	public static MemberDTO fromMember(Member member) {
		return MemberDTO.builder()
				.memberId(member.getMemberId())
                .email(member.getEmail())
                .name(member.getName())
                .pwd(member.getPwd())
                .job(member.getJob())
                .hasCareer(member.getHasCareer())
                .token(null) // token 필드는 null로 설정하거나 생략
                .build();
    }
	
}