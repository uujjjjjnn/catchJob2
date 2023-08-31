package com.project.catchJob.dto.project;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.domain.project.P_member;
import com.project.catchJob.domain.project.Project;
import com.project.catchJob.dto.board.B_commentsDTO;
import com.project.catchJob.dto.member.BoardMemberDTO;
import com.project.catchJob.dto.member.MemberInfoDTO;
import com.project.catchJob.service.ProjectService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@Data
@ToString(exclude = {"member", "comments", "applicants"})
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private Long projectId;
    private String type;
    private String title;
    private String field;
    private String loc;
    private String term;
    private boolean end;
    private String detail;
    private List<String> platforms;
	@JsonProperty("pCnt")
    private int pCnt;
	@JsonProperty("pLike")
    private int pLike;
	@JsonProperty("isLike")
    private boolean isLike;
    private Map<String, Integer> crew;
    private String email;
    
	private MemberInfoDTO member;
	private List<P_commentsDTO> comments;
	private List<P_memberDTO> applicants;
	
	public static ProjectDTO loginDTO(Project project, Member member, ProjectService projectService, String frontFilePath) {
		
		Member writer = project.getMember();
//		String fileUrl = "https://main--classy-kleicha-484f07.netlify.app/.netlify/functions/proxy/upload/";
//		String fileUrl = "http://43.202.98.45:8089/upload/";
//		String fileUrl = "https://43.202.98.45:8089/upload/";
		
		String fileUrl;
		if(writer.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
			fileUrl = writer.getMProfile().getMStoredFileName();
		} else {
			fileUrl = frontFilePath + writer.getMProfile().getMStoredFileName();
		}
		
		MemberInfoDTO memberDTO = MemberInfoDTO.builder()
				.email(writer.getEmail())
				.name(writer.getName())
				.job(writer.getJob())
				.hasCareer(writer.getHasCareer())
				.mOriginalFileName(fileUrl)
				.build();
		
		List<P_commentsDTO> comments = project.getProjectCommentsList() != null ? project.getProjectCommentsList()
				.stream()
				.map(comment -> {
				
					Member commentMember = comment.getMember();
		            String profileUrl;
		            if(commentMember.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
		            	profileUrl = commentMember.getMProfile().getMStoredFileName();
		            } else {
		            	profileUrl = frontFilePath + commentMember.getMProfile().getMStoredFileName();
		            }
				
				return P_commentsDTO.builder()
						.commentId(comment.getPComId())
						.commentContent(comment.getPComContent())
						.commentDate(comment.getPComDate())
						.memberName(comment.getMember().getName())
						.memberEmail(comment.getMember().getEmail())
						.memberProfile(profileUrl)
						.build();
				})
				.collect(Collectors.toList()) : new ArrayList<>();
		
		List<P_memberDTO> applicants = project.getProjectMemberList() != null ? project.getProjectMemberList()
				.stream()
				.map(applicant -> P_memberDTO.builder()
						.projectMemberId(applicant.getPMemId())
						.projectJob(applicant.getJob())
						.projectReason(applicant.getReason())
						.memberName(applicant.getMember().getName())
						.memberEmail(applicant.getMember().getEmail())
						.build())
				.collect(Collectors.toList()) : new ArrayList<>();
		
		boolean isLike = projectService.isUserLiked(member.getEmail(), project.getProjectId());
		
		ProjectDTO projectDTO = ProjectDTO.builder()
				.projectId(project.getProjectId())
				.type(project.getType())
				.title(project.getTitle())
				.field(project.getField())
				.loc(project.getLoc())
				.term(project.getTerm())
				.end(project.isEnd())
				.detail(project.getDetail())
				.platforms(project.getPlatforms() != null ? new ArrayList<>(project.getPlatforms()) : new ArrayList<>())
				.crew(project.getCrew())
				.pCnt(project.getPCnt())
				.pLike(project.getPLike())
				.isLike(isLike)
				.email(member.getEmail())
				.member(memberDTO)
				.comments(comments)
				.applicants(applicants)
				.build();
		
		return projectDTO;
		
	}
	public static ProjectDTO logoutDTO(Project project, String frontFilePath) {
		
		Member writer = project.getMember();
//		String fileUrl = "https://main--classy-kleicha-484f07.netlify.app/.netlify/functions/proxy/upload/";
//		String fileUrl = "http://43.202.98.45:8089/upload/";
//		String fileUrl = "https://43.202.98.45:8089/upload/";
		
		String fileUrl;
		if(writer.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
			fileUrl = writer.getMProfile().getMStoredFileName();
		} else {
			fileUrl = frontFilePath + writer.getMProfile().getMStoredFileName();
		}
		
		MemberInfoDTO memberDTO = MemberInfoDTO.builder()
				.email(writer.getEmail())
				.name(writer.getName())
				.job(writer.getJob())
				.hasCareer(writer.getHasCareer())
				.mOriginalFileName(fileUrl)
				.build();
		
		List<P_commentsDTO> comments = project.getProjectCommentsList() != null ? project.getProjectCommentsList()
				.stream()
				.map(comment -> {
				
					Member commentMember = comment.getMember();
		            String profileUrl;
		            if(commentMember.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
		            	profileUrl = commentMember.getMProfile().getMStoredFileName();
		            } else {
		            	profileUrl = frontFilePath + commentMember.getMProfile().getMStoredFileName();
		            }
				
				return P_commentsDTO.builder()
						.commentId(comment.getPComId())
						.commentContent(comment.getPComContent())
						.commentDate(comment.getPComDate())
						.memberName(comment.getMember().getName())
						.memberEmail(comment.getMember().getEmail())
						.memberProfile(profileUrl)
						.build();
				})
				.collect(Collectors.toList()) : new ArrayList<>();
		
		List<P_memberDTO> applicants = project.getProjectMemberList() != null ? project.getProjectMemberList()
				.stream()
				.map(applicant -> P_memberDTO.builder()
						.projectMemberId(applicant.getPMemId())
						.projectJob(applicant.getJob())
						.projectReason(applicant.getReason())
						.memberName(applicant.getMember().getName())
						.memberEmail(applicant.getMember().getEmail())
						.build())
				.collect(Collectors.toList()) : new ArrayList<>();
		
		ProjectDTO projectDTO = ProjectDTO.builder()
				.projectId(project.getProjectId())
				.type(project.getType())
				.title(project.getTitle())
				.field(project.getField())
				.loc(project.getLoc())
				.term(project.getTerm())
				.end(project.isEnd())
				.detail(project.getDetail())
				.platforms(project.getPlatforms() != null ? new ArrayList<>(project.getPlatforms()) : new ArrayList<>())
				.crew(project.getCrew())
				.pCnt(project.getPCnt())
				.pLike(project.getPLike())
				.isLike(false)
				.email(memberDTO.getEmail())
				.member(memberDTO)
				.comments(comments)
				.applicants(applicants)
				.build();
		
		return projectDTO;
		
	}
}
