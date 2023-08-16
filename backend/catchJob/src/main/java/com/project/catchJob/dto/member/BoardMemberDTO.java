package com.project.catchJob.dto.member;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardMemberDTO {

	private String email;
	private String name;
	@JsonProperty("mOriginalFileName")
	private String mOriginalFileName;
}