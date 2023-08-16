package com.project.catchJob.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.catchJob.domain.board.B_comments;
import com.project.catchJob.domain.board.Board;
import com.project.catchJob.domain.community.C_comments;
import com.project.catchJob.domain.community.Community;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.board.B_commentsDTO;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.dto.community.C_commentsDTO;
import com.project.catchJob.dto.community.CommunityDTO;
import com.project.catchJob.exception.UnauthorizedException;
import com.project.catchJob.security.JwtUtils;
import com.project.catchJob.service.CommonService;
import com.project.catchJob.service.CommunityService;
import com.project.catchJob.service.MemberService;
import com.project.catchJob.service.ProjectService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;

@RequiredArgsConstructor
@RestController
@RequestMapping("/community")
public class CommunityController {

	@Autowired
	private final CommunityService communityService;
	private final MemberService memberService;
	private final CommonService commonService;

	@Autowired
	private JwtUtils jwtUtils;

	//글 작성
	@PostMapping
	public ResponseEntity<Long> createCommunity(@RequestBody CommunityDTO communityDTO, @RequestHeader(value="Authorization") String jwtToken) {
		Community savedCommunity = communityService.createCommunity(communityDTO, jwtToken);
		return ResponseEntity.ok(savedCommunity.getCommunityId());
	}

	// 글 목록
	@GetMapping
	public ResponseEntity<List<CommunityDTO>> getAllCommunities(
			@RequestHeader(value="Authorization", 
			required = false) String jwtToken) {
		List<CommunityDTO> communities = communityService.getAllCommunities(jwtToken);
		return ResponseEntity.ok(communities);
	}
	
	// 글 수정
	@PutMapping("/edit")
	public ResponseEntity<?> edit(@RequestBody CommunityDTO communityDTO,
								  @RequestParam("communityId") Long communityId,
								  @RequestHeader("Authorization") String jwtToken) {
		communityService.edit(communityId, communityDTO, jwtToken);
		return ResponseEntity.ok().build();
	}
	
	// 글 삭제
	@DeleteMapping("/delete")
	public ResponseEntity<?> delete(@RequestParam("communityId") Long communityId,
			  						@RequestHeader("Authorization") String jwtToken) {
		communityService.delete(communityId, jwtToken);
		return ResponseEntity.ok().build();
	}
	
	// 댓글 등록
	@PostMapping("/comment/insert")
	public ResponseEntity<?> createComment(@RequestBody C_commentsDTO commentDTO,
			@RequestHeader("Authorization") String jwtToken) {
		CommentResponse commentRes = communityService.createComment(commentDTO, jwtToken);
		return ResponseEntity.ok(commentRes);
	}

	// 댓글 수정
	@PutMapping("/comment/edit")
	public ResponseEntity<?> editComment(@RequestBody C_commentsDTO commentDTO,
			@RequestParam("commentId") Long commentId,
			@RequestHeader("Authorization") String jwtToken) {
		CommentResponse commentRes = communityService.editComment(commentId, commentDTO, jwtToken);
		return ResponseEntity.ok(commentRes);
	}
	
	// 댓글 삭제
	@DeleteMapping("/comment/delete")
	public ResponseEntity<?> deleteComment(@RequestParam("commentId") Long commentId,
			@RequestHeader("Authorization") String jwtToken) {
		communityService.deleteComment(commentId, jwtToken);
		return ResponseEntity.ok().build();
	}
	
	// 댓글 리스트 조회
	@GetMapping("/comment/list")
	public ResponseEntity<List<C_commentsDTO>> getComments(@RequestParam("communityId") Long community_id) {
		List<C_commentsDTO> comments = communityService.getCommentsByCommunityId(community_id);
		return ResponseEntity.ok(comments);
	}
	
	// 좋아요
	@PostMapping("/like")
	public ResponseEntity<?> like(@RequestParam("communityId") Long communityId,
			@RequestHeader("Authorization") String jwtToken) throws NotFoundException {
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		String email = optAuthenticatedMember.getEmail();
		boolean isLiked = communityService.isUserLiked(email, communityId);
		
		Community community;
		if(isLiked) {
			communityService.delete(email, communityId);
			community = communityService.updateLike(communityId, false);
		} else {
			communityService.insert(email, communityId);
			community = communityService.updateLike(communityId, true);
		}
		int updatedLikeCnt = community.getCLike();
		return ResponseEntity.ok(updatedLikeCnt);
	}
	

}