package com.project.catchJob.dto.board;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.catchJob.domain.board.Board;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.member.BoardMemberDTO;
import com.project.catchJob.service.BoardService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardDTO {

	private Long boardId;
	
	@JsonProperty("bTitle")
	private String bTitle;
	
	@JsonProperty("bContents")
	private String bContents;
	
	@JsonProperty("bCnt")
	private int bCnt;
	
	@JsonProperty("bLike")
	private int bLike;
	
	@JsonProperty("isLike")
	private boolean isLike; // 내가 좋아요했는지 알 수 있는 여부
	
	@JsonProperty("bComment")
	private int bComment; // 댓글갯수
	
	@JsonProperty("bFileName")
	private String bFileName;
	
	@JsonProperty("bCoverFileName")
	private String bCoverFileName;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	@JsonProperty("bDate")
	private Date bDate;
	
	private List<String> tags;
	
	private BoardMemberDTO member;
	private List<B_commentsDTO> comments;
	
	// board에서 BoardDTO로 변환하는 메서드
	public static BoardDTO toDTO(Board board, Member member, BoardService boardService, String frontFilePath) {
		
		BoardMemberDTO memberDTO = null;
		Member writer = board.getMember();
		if (writer != null) {
			
			String fileUrl;
			if(writer.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
				fileUrl = writer.getMProfile().getMStoredFileName();
			} else {
				fileUrl = frontFilePath + writer.getMProfile().getMStoredFileName();
			}
			
		    memberDTO = new BoardMemberDTO();
		    memberDTO.setEmail(writer.getEmail());
		    memberDTO.setName(writer.getName());
		    memberDTO.setMOriginalFileName(fileUrl);
		}
		
		// 내가 좋아요했는지 여부 확인
		boolean isLike = boardService.isUserLiked(member.getEmail(), board.getBoardId());
		
		List<String> tagList = board.getTags();
		String[] tags = tagList.toArray(new String[0]);
		
		int bComment = board.getBoardCommentsList().size(); // 게시글에 작성된 댓글 수를 구함

		List<B_commentsDTO> commentDTOList = board.getBoardCommentsList().stream()
		        .map(comment -> {
		        	
		            Member commentMember = comment.getMember();
		            String fileUrl;
		            if(commentMember.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
		                fileUrl = commentMember.getMProfile().getMStoredFileName();
		            } else {
		                fileUrl = frontFilePath + commentMember.getMProfile().getMStoredFileName();
		            }
		        	
		            return B_commentsDTO.builder()
		                    .commentId(comment.getBComId())
		                    .commentContent(comment.getBComContent())
		                    .commentDate(comment.getBComDate())
		                    .memberName(commentMember.getName())
		                    .memberEmail(commentMember.getEmail())
		                    .memberProfile(fileUrl)
		                    .build();
		        })
		        .collect(Collectors.toList());

		
		// 정상코드
//		List<B_commentsDTO> commentDTOList = board.getBoardCommentsList().stream()
//				.map(comment -> B_commentsDTO.builder()
//						.commentId(comment.getBComId())
//						.commentContent(comment.getBComContent())
//						.commentDate(comment.getBComDate())
//						.memberName(comment.getMember().getName())
//						.memberEmail(comment.getMember().getEmail())
//						.memberProfile(frontFilePath + comment.getMember().getMProfile().getMStoredFileName())
//						.build())
//				.collect(Collectors.toList());
		
		return BoardDTO.builder()
				.boardId(board.getBoardId())
				.bTitle(board.getBTitle())
				.bContents(board.getBContents())
				.bCnt(board.getBCnt())
				.bLike(board.getBLike())
				.isLike(isLike) // isLike 설정
				.bComment(bComment)
				.bFileName(frontFilePath + board.getBFileName()) // 경로+파일명
				.bCoverFileName(frontFilePath + board.getBCoverFileName()) // 경로+파일명
				.bDate(board.getBDate())
				.member(memberDTO) // 멤버 정보 설정
				.tags(board.getTags()) // 태그
				.comments(commentDTOList) // 댓글
				.build();
	}

	// 로그인하지 않은 사용자
	public static BoardDTO toDTOWithoutMember(Board board, String frontFilePath) {
		// 필요한 사용자 정보를 memberDTO에 저장
		BoardMemberDTO memberDTO = null;
		Member member = board.getMember();
		if (member != null) {
			
			String fileUrl;
			if(member.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
				fileUrl = member.getMProfile().getMStoredFileName();
			} else {
				fileUrl = frontFilePath + member.getMProfile().getMStoredFileName();
			}
			
		    memberDTO = new BoardMemberDTO();
		    memberDTO.setEmail(member.getEmail());
		    memberDTO.setName(member.getName());
		    memberDTO.setMOriginalFileName(fileUrl);
		}

		int bComment = board.getBoardCommentsList().size(); // 댓글 수 계산

		List<String> tags = board.getTags() != null ? board.getTags() : new ArrayList<>();
		
		List<B_commentsDTO> comments = board.getBoardCommentsList() != null ? board.getBoardCommentsList().stream()
		        .map(comment -> {
		        	
		            Member commentMember = comment.getMember();
		            String fileUrl;
		            if(commentMember.getMProfile().getMStoredFileName().contains("https://lh3.googleusercontent.com")) {
		                fileUrl = commentMember.getMProfile().getMStoredFileName();
		            } else {
		                fileUrl = frontFilePath + commentMember.getMProfile().getMStoredFileName();
		            }
		        	
		            return B_commentsDTO.builder()
		                    .commentId(comment.getBComId())
		                    .commentContent(comment.getBComContent())
		                    .commentDate(comment.getBComDate())
		                    .memberName(commentMember.getName())
		                    .memberEmail(commentMember.getEmail())
		                    .memberProfile(fileUrl)
		                    .build();
		        })
		        .collect(Collectors.toList()) : new ArrayList<>();
		
		// 정상코드
//		List<B_commentsDTO> comments = board.getBoardCommentsList() != null ? board.getBoardCommentsList().stream()
//		        .map(comment -> B_commentsDTO.builder()
//		        	.commentId(comment.getBComId())	
//		            .commentContent(comment.getBComContent())
//		            .commentDate(comment.getBComDate())
//		            .memberName(comment.getMember().getName())
//		            .memberEmail(comment.getMember().getEmail())
//		            .memberProfile(frontFilePath + comment.getMember().getMProfile().getMStoredFileName())
//		            .build())
//		        .collect(Collectors.toList()) : new ArrayList<>();
		String bFileUrl = "";
	    String bCoverFileUrl = "";

	    if (board.getBFileName() != null) {
	    	bFileUrl = frontFilePath + board.getBFileName();
	    }

	    if (board.getBCoverFileName() != null) {
	        bCoverFileUrl = frontFilePath + board.getBCoverFileName();
	    }

		return BoardDTO.builder()
				.boardId(board.getBoardId())
				.bTitle(board.getBTitle())
				.bContents(board.getBContents())
				.bCnt(board.getBCnt())
				.bLike(board.getBLike())
				.isLike(false) // 로그인하지 않은 사용자는 항상 false
				.bComment(bComment) // 댓글 수 계산
				.bFileName(bFileUrl)
				.bCoverFileName(bCoverFileUrl)
				.bDate(board.getBDate())
				.member(memberDTO) // 멤버 정보 설정
				.tags(board.getTags()) // 태그
				.comments(comments) // 댓글
				.build();
	}	
	
}