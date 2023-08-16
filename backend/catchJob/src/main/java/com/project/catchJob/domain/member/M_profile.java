package com.project.catchJob.domain.member;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@ToString(exclude = "member")
@Entity
public class M_profile {

	@Id @GeneratedValue
	private Long mProfileId; // 멤버프로필 아이디
	
	private String mOriginalFileName; // 원본파일이름
	
	private String mStoredFileName; // 서버저장용파일이름
	
	@OneToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	public static M_profile toMProfile(Member member, String mOriginalFileName, String mStoredFileName) {
		M_profile mProfile = M_profile.builder()
				.mOriginalFileName(mOriginalFileName)
				.mStoredFileName(mStoredFileName)
				.member(member)
				.build();
		return mProfile;
	}
	
}