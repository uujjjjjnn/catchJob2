package com.project.catchJob.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GoogleOAuthTokenDTO {

	// 구글에서 얻은 token 담을 DTO
	
	private String access_token;
	private Integer expires_in;
	private String scope;
	private String token_type;
	private String id_token;
	private String refresh_token;
	
}
