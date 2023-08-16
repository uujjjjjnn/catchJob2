package com.project.catchJob.dto.community;

import java.time.LocalDateTime;

import javax.persistence.Column;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.catchJob.domain.community.C_comments;
import com.project.catchJob.domain.member.M_profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;

import lombok.ToString;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown=true)
public class C_commentsDTO {
	
	private Long commentId;
	@JsonProperty("cComcontent")
	private String ccommentContent;
	private Long communityId;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime commentDate;
	private String memberName;
	private String memberEmail;
	private String memberProfile;
	
	public static C_commentsDTO toDTO(C_comments commentEntity) {
		
//		String profileUrl = "https://43.202.98.45:8089/upload/" + commentEntity.getMember().getMProfile().getMStoredFileName();
		String profileUrl = "http://43.202.98.45:8089/upload/" + commentEntity.getMember().getMProfile().getMStoredFileName();
		
	    return C_commentsDTO.builder()
	            .commentId(commentEntity.getCComId())
	            .ccommentContent(commentEntity.getCComcontent())
	            .communityId(commentEntity.getCommunity().getCommunityId())
	            .commentDate(commentEntity.getCComDate())
	            .memberName(commentEntity.getMember().getName())
	            .memberEmail(commentEntity.getMember().getEmail())
	            .memberProfile(profileUrl)
	            .build();
	}

}
