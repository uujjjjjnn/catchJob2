package com.project.catchJob.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.project.catchJob.domain.board.Board;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.domain.project.Project;
import com.project.catchJob.dto.board.BoardDTO;
import com.project.catchJob.exception.TokenExpiredException;
import com.project.catchJob.repository.board.BoardRepository;
import com.project.catchJob.repository.community.CommunityRepository;
import com.project.catchJob.repository.member.MemberRepository;
import com.project.catchJob.repository.project.ProjectRepository;
import com.project.catchJob.security.TokenProvider;

@Service
public class CommonService {
	private final TokenProvider tokenProvider;
    private final MemberRepository memberRepo;
    private BoardRepository boardRepo;
    private ProjectRepository projectRepo;
    private CommunityRepository commRepo;
    @Value("${front.file.path}") private String frontFilePath;

    @Autowired
    public CommonService(TokenProvider tokenProvider, 
    					MemberRepository memberRepo,
    					BoardRepository boardRepo,
    					ProjectRepository projectRepo,
    					CommunityRepository commRepo) {
    	this.tokenProvider = tokenProvider;
        this.memberRepo = memberRepo;
        this.boardRepo = boardRepo;
        this.projectRepo = projectRepo;
        this.commRepo = commRepo;
    }
    
	// 인증 관련 메소드 구현
	public Optional<Member> getAuthenticatedMember(String jwtToken) {
	    if (jwtToken == null || !jwtToken.startsWith("Bearer ")) {
	        return Optional.empty();
	    }
	    String token = jwtToken.substring(7);
	    boolean isValidToken = tokenProvider.validateToken(token);

	    if (!isValidToken) {
	    	throw new TokenExpiredException("Token expired");
	    }

	    String userEmail = tokenProvider.getUserEmail(token);
	    return memberRepo.findOptionalByEmail(userEmail); // 새로 추가한 메소드 호출
	}
	
	// 검색
	public List<Object> search(String keyword) {
        List<Object> results = new ArrayList<>();

        // 제목
        addBoardsToResults(results, boardRepo.findByBTitleContaining(keyword), frontFilePath);
        addProjectsToResults(results, projectRepo.findByTitleContaining(keyword));

        // 멤버 이름
        addBoardsToResults(results, boardRepo.findByMemberNameContaining(keyword), frontFilePath);
        addProjectsToResults(results, projectRepo.findByMemberNameContaining(keyword));

        // 태그
        addBoardsToResults(results, boardRepo.findByTagsContaining(keyword), frontFilePath);

        return results;
    }

    private void addBoardsToResults(List<Object> results, List<? extends Board> boardResults, String filePath) {
        for (Board board : boardResults) {
            if (!Project.class.isInstance(board)) {
                BoardDTO dto = BoardDTO.toDTOWithoutMember(board, filePath);
                results.add(dto);
            }
        }
    }

    private void addProjectsToResults(List<Object> results, List<Project> projectResults) {
        results.addAll(projectResults);
    }
}