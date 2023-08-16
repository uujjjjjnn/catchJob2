package com.project.catchJob.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import com.project.catchJob.domain.member.Member;
import com.project.catchJob.domain.project.P_comments;
import com.project.catchJob.domain.project.P_like;
import com.project.catchJob.domain.project.P_member;
import com.project.catchJob.domain.project.Project;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.dto.member.MemberInfoDTO;
import com.project.catchJob.dto.project.P_commentsDTO;
import com.project.catchJob.dto.project.P_memberDTO;
import com.project.catchJob.dto.project.ProjectDTO;
import com.project.catchJob.exception.UnauthorizedException;
import com.project.catchJob.repository.member.MemberRepository;
import com.project.catchJob.repository.project.PLikeRepository;
import com.project.catchJob.repository.project.P_commentsRepository;
import com.project.catchJob.repository.project.P_memberRepository;
import com.project.catchJob.repository.project.ProjectRepository;
import com.project.catchJob.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService {

	@Autowired
	private final ProjectRepository projectRepository;
	@Autowired
	private MemberRepository memberRepository;
	@Autowired
	private JwtUtils jwtUtils;
	@Autowired
	private CommonService commonService;
	@Autowired
	private P_commentsRepository pCommRepo;
	@Autowired
	private PLikeRepository pLikeRepo;
	@Autowired
	private P_memberRepository pMemberRepo;
	@PersistenceContext
	private EntityManager entityManager;
	@Value("${front.file.path}")
	private String frontFilePath;

	@Override
	public Project addProject(ProjectDTO projectDTO, String userEmail) {
		Member member = memberRepository.findByEmail(projectDTO.getEmail());

		Project project = new Project();
		project.setTitle(projectDTO.getTitle());
		project.setField(projectDTO.getField());
		project.setTerm(projectDTO.getTerm());
		project.setPlatforms(
				projectDTO.getPlatforms() != null ? new ArrayList<>(projectDTO.getPlatforms()) : new ArrayList<>());
		project.setType(projectDTO.getType());
		project.setLoc(projectDTO.getLoc());
		project.setCrew(projectDTO.getCrew());
		project.setDetail(projectDTO.getDetail());
		project.setMember(member);

		return projectRepository.save(project);
	}

	@Override
	public List<ProjectDTO> getAllProjects(String jwtToken) {
		List<Project> projects = projectRepository.findAll();
		
		if(jwtToken != null) {
			Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
					.orElseThrow(UnauthorizedException::new);
			return projects.stream()
					.map(project -> ProjectDTO.loginDTO(project, optAuthenticatedMember, this, frontFilePath))
					.collect(Collectors.toList());
		}
		
		return projects.stream()
				.map(project -> ProjectDTO.logoutDTO(project, frontFilePath))
				.collect(Collectors.toList());
	}

	@Override
	public ProjectDTO getProjectByProjectId(Long projectId, String jwtToken) {

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));

		ProjectDTO projectDTO;
		if(jwtToken != null) {
			Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
					.orElseThrow(UnauthorizedException::new);
			projectDTO = ProjectDTO.loginDTO(project, optAuthenticatedMember, this, frontFilePath);
		} else {
			projectDTO = ProjectDTO.logoutDTO(project, frontFilePath);
		}
		return projectDTO;
		
	}

	// 글 수정
	@Override
	public void edit(Long projectId, ProjectDTO projectDTO, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));

		if (!optAuthenticatedMember.getEmail().equals(project.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		project.setType(projectDTO.getType());
		project.setTitle(projectDTO.getTitle());
		project.setField(projectDTO.getField());
		project.setLoc(projectDTO.getLoc());
		project.setTerm(projectDTO.getTerm());
		project.setDetail(projectDTO.getDetail());
		project.setPlatforms(projectDTO.getPlatforms());
		project.setCrew(projectDTO.getCrew());

		projectRepository.save(project);
	}

	// 글 삭제
	@Override
	public void delete(Long projectId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));

		if (!optAuthenticatedMember.getEmail().equals(project.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		projectRepository.deleteById(projectId);
	}

	// ======================== 댓글 ========================

	// 댓글 등록
	@Override
	public CommentResponse createComment(P_commentsDTO commentDTO, Long projectId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));

		P_comments comments = P_comments.builder().pComContent(commentDTO.getCommentContent()).member(optAuthenticatedMember)
				.project(project).build();
		P_comments saveComm = pCommRepo.save(comments);
		pCommRepo.flush();
		return new CommentResponse(saveComm.getPComDate());
	}

	// 댓글 수정
	@Override
	public CommentResponse editComment(P_commentsDTO commentDTO, Long commentId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		P_comments comment = pCommRepo.findById(commentId).orElseThrow(() -> new EntityNotFoundException("댓글이 없음"));

		if (!optAuthenticatedMember.getEmail().equals(comment.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		comment.setPComContent(commentDTO.getCommentContent());
		comment.setPComDate(LocalDateTime.now());
		P_comments saveComm = pCommRepo.save(comment);
		pCommRepo.flush();
		return new CommentResponse(saveComm.getPComDate());
	}

	// 댓글 삭제
	@Override
	public void deleteComment(Long commentId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		P_comments comment = pCommRepo.findById(commentId).orElseThrow(() -> new EntityNotFoundException("댓글이 없음"));

		if (!optAuthenticatedMember.getEmail().equals(comment.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		pCommRepo.deleteById(commentId);

	}

	// ======================== 좋아요 ========================

	// 좋아요 확인
	@Override
	public boolean isUserLiked(String email, Long projectId) {
		Member member = memberRepository.findOptionalByEmail(email).orElse(null);
		if (member == null) {
			return false;
		}

		Project project = projectRepository.findById(projectId).orElse(null);
		if (project == null) {
			return false;
		}

		Optional<P_like> like = pLikeRepo.findByMemberAndProject(member, project);
		return like.isPresent();
	}

	// 좋아요 추가
	@Override
	public void insert(String email, Long projectId) throws Exception {
		Member member = memberRepository.findOptionalByEmail(email).orElseThrow(() -> new NotFoundException());

		Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException());

		P_like like = P_like.builder().project(project).member(member).build();

		pLikeRepo.save(like);
	}

	// 좋아요 취소
	@Override
	public void delete(String email, Long projectId) throws Exception {
		Member member = memberRepository.findOptionalByEmail(email).orElseThrow(() -> new NotFoundException());

		Project project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException());

		P_like like = pLikeRepo.findByMemberAndProject(member, project).orElseThrow(() -> new NotFoundException());

		pLikeRepo.delete(like);
	}

	// 좋아요 수 업데이트
	@Transactional
	@Override
	public Project updateLike(Long projectId, boolean b) throws Exception {
		int increment = b ? 1 : -1;
		projectRepository.updateLike(projectId, increment);
		entityManager.flush();
		entityManager.clear();
		Project project = projectRepository.findById(projectId).orElseThrow(NotFoundException::new);

		return project;
	}

	// ======================== 조회수 ========================

	// 조회수 업데이트
	@Override
	public int updateCnt(Long projectId) throws NotFoundException {
		projectRepository.updateCnt(projectId);
		Project project = projectRepository.findById(projectId).orElseThrow(NotFoundException::new);
		return project.getPCnt();
	}

	// ======================== 지원 ========================

	// 모집 완료
	@Override
	public void end(Long projectId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));

		if (!optAuthenticatedMember.getEmail().equals(project.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		boolean isEnd = project.isEnd();
		if (isEnd) {
			project.setEnd(false);
		} else {
			project.setEnd(true);
		}
		projectRepository.save(project);
	}

	// 지원
	@Override
	public P_member apply(Long projectId, String job, P_memberDTO memberDTO, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		Project project = projectRepository.findById(projectId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));

		P_member member = P_member.builder()
				.job(job)
				.reason(memberDTO.getProjectReason())
				.member(optAuthenticatedMember)
				.project(project)
				.build();

		return pMemberRepo.save(member);
	}

	// 지원 취소
	@Override
	public void cancel(Long projectMemberId, String jwtToken) {
		
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		P_member findMember = pMemberRepo.findById(projectMemberId)
				.orElseThrow(() -> new EntityNotFoundException("지원 내역 없음"));
		
		if (!optAuthenticatedMember.getEmail().equals(findMember.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		pMemberRepo.deleteById(projectMemberId);
		
	}

	// 직무 별 지원자 목록
	@Override
	public List<P_member> applyList(Long projectId, String job, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		List<P_member> findMembers = pMemberRepo.findByProjectIdAndJob(projectId, job);

		List<P_member> filteredMembers = findMembers.stream()
		        .filter(member -> optAuthenticatedMember.getEmail().equals(member.getMember().getEmail()))
		        .collect(Collectors.toList());
		if (filteredMembers.isEmpty()) {
	        throw new EntityNotFoundException("해당 프로젝트의 직무에 일치한 내용 없음");
	    }
		return filteredMembers;
	}



}