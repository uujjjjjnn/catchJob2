package com.project.catchJob.dto.community;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.catchJob.domain.community.Community;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.member.BoardMemberDTO;
import com.project.catchJob.service.CommunityService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Data
@Builder
@ToString(exclude= {"member", "comments"})
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CommunityDTO {
	
	private Long communityId;
	@JsonProperty("cType")
	private String cType; 
	@JsonProperty("cTitle")
    private String cTitle;
	@JsonProperty("cContents")
    private String cContents;
	@JsonProperty("cDate")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime cDate;
	@JsonProperty("cLike")
    private int cLike;
	@JsonProperty("isLike")
    private boolean isLike;
	@JsonProperty("cComment")
	private int cComment;
    private BoardMemberDTO member;
	private List<C_commentsDTO> comments;
	
	public static CommunityDTO loginListDTO(Community community, Member member, CommunityService communityService, String frontFilePath) {
		
		BoardMemberDTO memberDTO = null;
		Member writer = community.getMember();
		if(writer != null) {
			
			memberDTO = new BoardMemberDTO();
			memberDTO.setEmail(writer.getEmail());
			memberDTO.setName(writer.getName());
			memberDTO.setMOriginalFileName(frontFilePath + writer.getMProfile().getMStoredFileName());
		}
		
		List<C_commentsDTO> comments = community.getCommunityCommentsList() != null ? community.getCommunityCommentsList()
				.stream()
				.map(comment -> C_commentsDTO.builder()
						.commentId(comment.getCComId())
						.ccommentContent(comment.getCComcontent())
						.commentDate(comment.getCComDate())
						.memberName(comment.getMember().getName())
						.memberEmail(comment.getMember().getEmail())
						.memberProfile(frontFilePath + comment.getMember().getMProfile().getMStoredFileName())
						.build())
				.collect(Collectors.toList()) : new ArrayList<>();
				
		boolean isLike = communityService.isUserLiked(member.getEmail(), community.getCommunityId());
		int cComment = community.getCommunityCommentsList().size();
		
		return CommunityDTO.builder()
				.communityId(community.getCommunityId())
				.cType(community.getCType())
				.cTitle(community.getTitle())
				.cContents(community.getCContents())
				.cDate(community.getCDate())
				.cLike(community.getCLike())
				.isLike(isLike)
				.cComment(cComment)
				.member(memberDTO)
				.comments(comments)
				.build();
	}

	public static CommunityDTO logoutListDTO(Community community, String frontFilePath) {
		
		BoardMemberDTO memberDTO = null;
		Member writer = community.getMember();
		if(writer != null) {
			
			memberDTO = new BoardMemberDTO();
			memberDTO.setEmail(writer.getEmail());
			memberDTO.setName(writer.getName());
			memberDTO.setMOriginalFileName(frontFilePath + writer.getMProfile().getMStoredFileName());
		}
		
		List<C_commentsDTO> comments = community.getCommunityCommentsList() != null ? community.getCommunityCommentsList()
				.stream()
				.map(comment -> C_commentsDTO.builder()
						.commentId(comment.getCComId())
						.ccommentContent(comment.getCComcontent())
						.commentDate(comment.getCComDate())
						.memberName(comment.getMember().getName())
						.memberEmail(comment.getMember().getEmail())
						.memberProfile(frontFilePath + comment.getMember().getMProfile().getMStoredFileName())
						.build())
				.collect(Collectors.toList()) : new ArrayList<>();
			
		int cComment = community.getCommunityCommentsList().size();
		
		return CommunityDTO.builder()
				.communityId(community.getCommunityId())
				.cType(community.getCType())
				.cTitle(community.getTitle())
				.cContents(community.getCContents())
				.cDate(community.getCDate())
				.cLike(community.getCLike())
				.isLike(false)
				.cComment(cComment)
				.member(memberDTO)
				.comments(comments)
				.build();
	}
	
}
