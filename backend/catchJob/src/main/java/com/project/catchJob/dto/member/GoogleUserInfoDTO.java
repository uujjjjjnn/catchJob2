package com.project.catchJob.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GoogleUserInfoDTO {
	
	// 구글 사용자 정보 담을 DTO
	
	private String id;
	private String email;
	private Boolean verified_email;
	private String name;
	private String given_name;
	private String family_name;
	private String picture;
	private String locale;

}
