// ProjectService.java
package com.project.catchJob.service;

import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;

import com.project.catchJob.domain.project.P_member;
import com.project.catchJob.domain.project.Project;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.dto.project.P_commentsDTO;
import com.project.catchJob.dto.project.ProjectDTO;
import com.project.catchJob.dto.project.P_memberDTO;

public interface ProjectService {

	Project addProject(ProjectDTO projectDTO, String userEmail);
	List<ProjectDTO> getAllProjects(String jwtToken);
	ProjectDTO getProjectByProjectId(Long projectId, String jwtToken);
	void edit(Long projectId, ProjectDTO projectDTO, String jwtToken);
	void delete(Long projectId, String jwtToken);
	CommentResponse createComment(P_commentsDTO commentDTO, Long projectId, String jwtToken);
	CommentResponse editComment(P_commentsDTO commentDTO, Long commentId, String jwtToken);
	void deleteComment(Long commentId, String jwtToken);
	int updateCnt(Long projectId) throws NotFoundException;
	boolean isUserLiked(String email, Long projectId);
	void insert(String email, Long projectId) throws Exception;
	void delete(String email, Long projectId) throws Exception;
	Project updateLike(Long projectId, boolean b) throws Exception;
	void end(Long projectId, String jwtToken);
	P_member apply(Long projectId, String job, P_memberDTO memberDTO, String jwtToken);
	void cancel(Long projectMemberId, String jwtToken);
	List<P_member> applyList(Long projectId, String job, String jwtToken);
}