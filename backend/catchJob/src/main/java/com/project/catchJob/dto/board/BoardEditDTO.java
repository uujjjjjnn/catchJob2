package com.project.catchJob.dto.board;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.catchJob.dto.member.MemberInfoDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardEditDTO {

	@JsonProperty("bTitle")
	private String bTitle;
	
	@JsonProperty("bContents")
	private String bContents;
	
	private List<String> tags;
	
	@JsonProperty("bFileName")
	private String bFileName;
	
	@JsonProperty("bCoverFileName")
	private String bCoverFileName;
}
