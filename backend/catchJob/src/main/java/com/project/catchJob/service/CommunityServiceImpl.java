package com.project.catchJob.service;

import org.hibernate.annotations.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

import com.project.catchJob.domain.community.C_comments;
import com.project.catchJob.domain.community.C_like;
import com.project.catchJob.domain.community.Community;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.dto.community.C_commentsDTO;
import com.project.catchJob.dto.community.CommunityDTO;
import com.project.catchJob.dto.member.MemberInfoDTO;
import com.project.catchJob.exception.UnauthorizedException;
import com.project.catchJob.repository.community.C_commentsRepository;
import com.project.catchJob.repository.community.C_likeRepository;
import com.project.catchJob.repository.community.CommunityRepository;
import com.project.catchJob.repository.member.MemberRepository;
import com.project.catchJob.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;

@RequiredArgsConstructor
@Service
public class CommunityServiceImpl implements CommunityService {

	@Autowired
	private final CommunityRepository communityRepository;
	@Autowired
	private MemberRepository memberRepository;
	@Autowired
	private JwtUtils jwtUtils;
	@Autowired
	private C_commentsRepository cCommRepo;
	@Autowired
	private C_likeRepository cLikeRepo;
	@PersistenceContext private EntityManager entityManager;
	@Autowired private CommonService commonService;
	@Value("${front.file.path}")
	private String frontFilePath;

	// 글 등록
	@Override
	public Community createCommunity(CommunityDTO communityDTO, String jwtToken) {
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		
		Community community = Community.builder()
				.title(communityDTO.getCTitle())
				.cType(communityDTO.getCType())
				.cContents(communityDTO.getCContents())
				.member(optAuthenticatedMember)
				.build();
		
		return communityRepository.save(community);
	}

	// 글 목록
	public List<CommunityDTO> getAllCommunities(String jwtToken) {
		Sort sort = Sort.by(Sort.DEFAULT_DIRECTION.DESC, "communityId");
		List<Community> communities = communityRepository.findAll(sort);
		
		if(jwtToken != null) {
			Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
					.orElseThrow(UnauthorizedException::new);
			return communities.stream()
					.map(community -> CommunityDTO.loginListDTO(community, optAuthenticatedMember, this, frontFilePath))
					.collect(Collectors.toList());
		}
		
		return communities.stream()
				.map(community -> CommunityDTO.logoutListDTO(community, frontFilePath))
				.collect(Collectors.toList());
	}
	
	// 글 수정
	@Override
	public CommentResponse edit(Long communityId, CommunityDTO communityDTO, String jwtToken) {
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		
		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));
		
		if(!optAuthenticatedMember.getEmail().equals(community.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		community.setCContents(communityDTO.getCContents());
		community.setCDate(LocalDateTime.now());
		community.setTitle(communityDTO.getCTitle());
		community.setCType(communityDTO.getCType());
		Community saveComm = communityRepository.save(community);
		communityRepository.flush();
		return new CommentResponse(saveComm.getCDate());
	}
	
	// 글 삭제
	@Override
	public void delete(Long communityId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		
		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));
		if(!optAuthenticatedMember.getEmail().equals(community.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		communityRepository.deleteById(communityId);
	}

	// 댓글 등록
	@Override
	public CommentResponse createComment(C_commentsDTO commentDTO, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		Community community = communityRepository.findById(commentDTO.getCommunityId())
				.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));

		C_comments comments = C_comments.builder().cComcontent(commentDTO.getCcommentContent()).member(optAuthenticatedMember)
				.community(community).build();
		C_comments saveComm = cCommRepo.save(comments);
		cCommRepo.flush();
		return new CommentResponse(saveComm.getCComDate());
	}
	
	// 댓글 수정
	@Override
	public CommentResponse editComment(Long commentId, C_commentsDTO commentDTO, String jwtToken) {
		
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);
		
		C_comments comment = cCommRepo.findById(commentId)
				.orElseThrow(() -> new EntityNotFoundException("댓글 없음"));
		if(!optAuthenticatedMember.getEmail().equals(comment.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		comment.setCComcontent(commentDTO.getCcommentContent());
		comment.setCComDate(LocalDateTime.now());
		C_comments saveComm = cCommRepo.save(comment);
		cCommRepo.flush();
		return new CommentResponse(saveComm.getCComDate());
	}

	// 댓글 삭제
	@Override
	public void deleteComment(Long commentId, String jwtToken) {

		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
				.orElseThrow(UnauthorizedException::new);

		C_comments comment = cCommRepo.findById(commentId).orElseThrow(() -> new EntityNotFoundException("댓글이 없음"));

		if (!optAuthenticatedMember.getEmail().equals(comment.getMember().getEmail())) {
			throw new UnauthorizedException();
		}
		cCommRepo.deleteById(commentId);

	}

	// 댓글 리스트 조회
	public List<C_commentsDTO> getCommentsByCommunityId(Long communityId) {

		List<C_comments> comments =  cCommRepo.findAllByCommunity_CommunityId(communityId);
		
		return comments.stream()
				.map(C_commentsDTO::toDTO)
				.collect(Collectors.toList());

	}

	// 좋아요 확인
	@Override
	public boolean isUserLiked(String email, Long communityId) {
		Member member = memberRepository.findOptionalByEmail(email).orElse(null);
		if(member == null) {
			return false;
		}
		Community community = communityRepository.findById(communityId).orElse(null);
		if(community == null) {
			return false;
		}
		Optional<C_like> like = cLikeRepo.findByMemberAndCommunity(member, community);
		return like.isPresent();
	}

	// 좋아요 추가
	@Override
	public void insert(String email, Long communityId) throws NotFoundException {
		Member member = memberRepository.findOptionalByEmail(email)
				.orElseThrow(() -> new NotFoundException());
		
		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new NotFoundException());
		
		C_like like = C_like.builder()
				.community(community)
				.member(member)
				.build();
		cLikeRepo.save(like);
				
	}

	// 좋아요 취소
	@Override
	public void delete(String email, Long communityId) throws NotFoundException {
		Member member = memberRepository.findOptionalByEmail(email)
				.orElseThrow(() -> new NotFoundException());
		
		Community community = communityRepository.findById(communityId)
				.orElseThrow(() -> new NotFoundException());
		C_like like = cLikeRepo.findByMemberAndCommunity(member, community)
				.orElseThrow(() -> new NotFoundException());
		
		cLikeRepo.delete(like);
				
	}

	// 좋아요 수 업데이트
	@Transactional
	@Override
	public Community updateLike(Long communityId, boolean b) throws NotFoundException {
		int increment = b ? 1 : -1;
		communityRepository.updateLike(communityId, increment);
		entityManager.flush();
		entityManager.clear();
		Community community = communityRepository.findById(communityId).orElseThrow(NotFoundException::new);
		
		return community;
	}


}