package com.project.catchJob.service;

import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;

import com.project.catchJob.domain.community.C_comments;
import com.project.catchJob.domain.community.Community;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.dto.community.C_commentsDTO;
import com.project.catchJob.dto.community.CommunityDTO;

public interface CommunityService {

	Community createCommunity(CommunityDTO communityDTO, String jwtToken);

	List<CommunityDTO> getAllCommunities(String jwtToken);
	CommentResponse edit(Long communityId, CommunityDTO communityDTO, String jwtToken);
	void delete(Long communityId, String jwtToken);

	List<C_commentsDTO> getCommentsByCommunityId(Long community_id);
	CommentResponse createComment(C_commentsDTO commentDTO, String jwtToken);
    CommentResponse editComment(Long commentId, C_commentsDTO commentDTO, String jwtToken);
	void deleteComment(Long commentId, String jwtToken);

	boolean isUserLiked(String email, Long communityId);
	void insert(String email, Long communityId) throws NotFoundException;
	void delete(String email, Long communityId) throws NotFoundException;
	Community updateLike(Long communityId, boolean liked) throws NotFoundException;

}