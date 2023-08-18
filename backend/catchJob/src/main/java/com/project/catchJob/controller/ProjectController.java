package com.project.catchJob.controller;

import com.project.catchJob.domain.member.Member;
import com.project.catchJob.domain.project.P_member;
import com.project.catchJob.domain.project.Project;
import com.project.catchJob.dto.board.B_commentsDTO;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.dto.project.P_commentsDTO;
import com.project.catchJob.dto.project.ProjectDTO;
import com.project.catchJob.dto.project.P_memberDTO;
import com.project.catchJob.exception.UnauthorizedException;
import com.project.catchJob.repository.member.MemberRepository;
import com.project.catchJob.security.JwtUtils;
import com.project.catchJob.service.CommonService;
import com.project.catchJob.service.MemberService;
import com.project.catchJob.service.ProjectService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/")
public class ProjectController {

	@Autowired
    private final ProjectService projectService;
    private final MemberService memberService;
    @Autowired CommonService commonService;
    @Autowired private JwtUtils jwtUtils;

    // 글 등록
    @PostMapping("/buildproject")
    public ResponseEntity<?> addProject(@RequestBody ProjectDTO projectDTO, HttpServletRequest request) {
    	String userEmail = jwtUtils.getEmailFromRequest(request);
    	Project savedProject = projectService.addProject(projectDTO, userEmail);
    	return ResponseEntity.ok(savedProject.getProjectId());
    }
    
    // 글 목록
    @GetMapping("/project")
    public ResponseEntity<List<ProjectDTO>> getAllProjects(@RequestHeader(value = "Authorization", required = false) String  jwtToken) {
        List<ProjectDTO> projects = projectService.getAllProjects(jwtToken);
        return ResponseEntity.ok(projects);
    }
    
    // 글 조회
    @GetMapping("/studyDetail/{id}")
    public ResponseEntity<?> getProjectByProjectId(@PathVariable("id") Long projectId,
    		@RequestHeader(value = "Authorization", required = false) String  jwtToken) throws NotFoundException {
    	
    	projectService.updateCnt(projectId);
        ProjectDTO project = projectService.getProjectByProjectId(projectId, jwtToken);
        
        return ResponseEntity.ok(project);
    }
    
    // 글 수정
    @PutMapping("/studyDetail/edit/{id}")
    public ResponseEntity<?> edit(@PathVariable("id") Long projectId, 
    							  @RequestBody ProjectDTO projectDTO,
    							  @RequestHeader("Authorization") String jwtToken) {
    	projectService.edit(projectId, projectDTO, jwtToken);
    	return ResponseEntity.ok().build();
    }
    
    // 글 삭제
    @DeleteMapping("/studyDetail/delete/{id}")
	public ResponseEntity<?> delete(
			@PathVariable("id") Long projectId,
	        @RequestHeader("Authorization") String jwtToken) 
	        throws Exception { 
		
	    projectService.delete(projectId, jwtToken);
	    return ResponseEntity.ok().build();
	}
    
//======================== 댓글 ========================
    
    // 댓글 등록
    @PostMapping("/studyDetail/comment/{id}")
    public ResponseEntity<?> registerComment(
    		@RequestBody P_commentsDTO commentDTO,
			@PathVariable("id") Long projectId,
			@RequestHeader("Authorization") String jwtToken) {
		
		CommentResponse commentRes = projectService.createComment(commentDTO, projectId, jwtToken);
		
		return ResponseEntity.ok(commentRes);
	}
    
    // 댓글 수정
    @PutMapping("/studyDetail/comment/edit/{id}")
    public ResponseEntity<?> editComment(
    		@RequestBody P_commentsDTO commentDTO,
    		@PathVariable("id") Long commentId,
    		@RequestHeader("Authorization") String jwtToken) {
    	
    	CommentResponse commentRes = projectService.editComment(commentDTO, commentId, jwtToken);
    	
    	return ResponseEntity.ok(commentRes);
    }
    
    // 댓글 삭제
    @DeleteMapping("/studyDetail/comment/delete/{id}")
    public ResponseEntity<?> deleteComment(
    		@PathVariable("id") Long commentId,
    		@RequestHeader("Authorization") String jwtToken) {
    	
    	projectService.deleteComment(commentId, jwtToken);
    	
    	return ResponseEntity.ok().build();
    }
    
    //======================== 좋아요 ========================
    
    @PostMapping("/studyDetail/like/{id}")
    public ResponseEntity<?> like(@RequestHeader("Authorization") String jwtToken, 
    							  @PathVariable("id") Long projectId) throws Exception {
    	Member authenticatedMember = commonService.getAuthenticatedMember(jwtToken)
    			.orElseThrow(UnauthorizedException::new);
		String email = authenticatedMember.getEmail();
		boolean isLiked = projectService.isUserLiked(email, projectId);
		
		Project project;
		if(isLiked) {
			projectService.delete(email, projectId);
			project = projectService.updateLike(projectId, false);
		} else {
			projectService.insert(email, projectId);
			project = projectService.updateLike(projectId, true);
		}
		int updatedLikeCount = project.getPLike();
		
		return ResponseEntity.ok(updatedLikeCount);
    }

    
  //======================== 지원 ========================
    
    // 지원 완료/취소 (글 작성자)
    @PutMapping("/studyDetail/done/{id}")
    public ResponseEntity<?> end(
			@PathVariable("id") Long projectId,
	        @RequestHeader("Authorization") String jwtToken) 
	        throws Exception { 
		
	    projectService.end(projectId, jwtToken);
	    return ResponseEntity.ok().build();
	}
    
    // 지원 (지원자)
    @PostMapping("/studyDetail/apply/{id}")
    public ResponseEntity<?> apply(
			@PathVariable("id") Long projectId,
			@RequestParam("job") String job,
			@RequestBody P_memberDTO memberDTO,
	        @RequestHeader("Authorization") String jwtToken) 
	        throws Exception { 
		
    	P_member member = projectService.apply(projectId, job, memberDTO, jwtToken);
	    return ResponseEntity.ok().body(member);
	}
    
    // 지원 취소 (지원자)
    @DeleteMapping("/studyDetail/cancel/{id}")
    public ResponseEntity<?> cancel(
			@PathVariable("id") Long projectMemberId,
	        @RequestHeader("Authorization") String jwtToken) 
	        throws Exception { 
		
    	projectService.cancel(projectMemberId, jwtToken);
	    return ResponseEntity.ok().build();
	} 
    
    // 직무 별 지원자 목록
    @GetMapping("/studyDetail/applyList/{id}")
    public ResponseEntity<?> applyList(
    		@PathVariable("id") Long projectId,
			@RequestParam("job") String job,
	        @RequestHeader("Authorization") String jwtToken) 
	        throws Exception { 
		
    	List<P_member> member = projectService.applyList(projectId, job, jwtToken);
	    return ResponseEntity.ok().body(member);
	}
    
  //======================== 채팅 ======================== 
    
    @GetMapping("/studyDetail/applyList/{id}/{member_id}")
    public ResponseEntity<?> chatList(@PathVariable("id") Long projectId,
    		@PathVariable("member_id") Long memberId,
    		@RequestParam("job") String job,
    		@RequestHeader("Authorization") String jwtToken) {
    	
    	
    	return ResponseEntity.ok().body(null);
    	
    }
    
    @PostMapping("/studyDetail/applyList/{id}/{member_id}")
    public ResponseEntity<?> chat(@PathVariable("id") Long projectId,
    				 @PathVariable("member_id") Long memberId,
    				 @RequestParam("job") String job,
    			     @RequestHeader("Authorization") String jwtToken) {
    	
    	
    	return ResponseEntity.ok().body(null);
    	
    }
  
}