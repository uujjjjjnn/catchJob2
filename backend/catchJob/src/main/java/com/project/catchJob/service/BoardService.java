package com.project.catchJob.service;

import java.io.File;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.project.catchJob.domain.board.B_comments;
import com.project.catchJob.domain.board.B_like;
import com.project.catchJob.domain.board.Board;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.board.B_commentsDTO;
import com.project.catchJob.dto.board.BoardDTO;
import com.project.catchJob.dto.board.BoardEditDTO;
import com.project.catchJob.dto.board.CommentResponse;
import com.project.catchJob.exception.UnauthorizedException;
import com.project.catchJob.repository.board.B_commentsRepository;
import com.project.catchJob.repository.board.B_likeRepository;
import com.project.catchJob.repository.board.BoardRepository;
import com.project.catchJob.repository.member.MemberRepository;


@Service
public class BoardService {
	
	@Value("${file.path}") private String filePath;
	@Value("${front.file.path}") private String frontFilePath;
	private final CommonService commonService;
	@PersistenceContext private EntityManager entityManager;
	
	@Autowired
	public BoardService(CommonService commonService) {
		this.commonService = commonService;
	}
	
	@Autowired private MemberRepository memberRepo;
	@Autowired private BoardRepository boardRepo;
	@Autowired private B_commentsRepository bCommRepo; // 댓글
	@Autowired private B_likeRepository bLikeRepo; // 좋아요
	
	// 글 목록
	public List<BoardDTO> getBoardList(String jwtToken) {
		Sort sort = Sort.by(Sort.DEFAULT_DIRECTION.DESC, "boardId");
		List<Board> boards = boardRepo.findAll(sort);	
	
		// 로그인한 사용자
		if(jwtToken != null) {
			Member member = commonService.getAuthenticatedMember(jwtToken)
					.orElseThrow(UnauthorizedException::new);
			return boards.stream()
					.map(board -> BoardDTO.toDTO(board, member, this, frontFilePath)) // member, bLikeRepo 전달
					.collect(Collectors.toList());
		}
		
		// 로그인하지 않은 사용자
		return boards.stream()
				.map(board -> BoardDTO.toDTOWithoutMember(board, frontFilePath))
				.collect(Collectors.toList());
	}

	// 글 등록
	public void create(String bTitle, String bContents, List<String> tags, MultipartFile bFile, MultipartFile bCoverFile, String jwtToken) {

	    Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
	    		.orElseThrow(UnauthorizedException::new);

	    Board board = Board.builder()
	            .bTitle(bTitle)
	            .bContents(bContents)
	            .tags(tags)
	            .member(optAuthenticatedMember)
	            .build();

	    // 파일 저장
	    if(bFile != null && !bFile.isEmpty()) {
	        String fileName = saveFile(bFile);
	        board.setBFileName(fileName);
	    }
	    if(bCoverFile != null && !bCoverFile.isEmpty()) {
	    	String fileName = saveFile(bCoverFile);
	    	board.setBCoverFileName(fileName);
	    }
	    boardRepo.save(board);
	}
    
    // 파일 저장
	public String saveFile(MultipartFile file) {
        try {
            // 저장 경로 지정
            File dir = new File(filePath);
            if (!dir.exists()) {
                dir.mkdirs(); // 폴더 없다면 폴더 생성
            }
            // 파일 이름 가져옴
            String originalFileName = file.getOriginalFilename();
            // 저장될 파일 이름 설정
            String storedFileName = UUID.randomUUID() + "_" + originalFileName;
            // 지정된 경로에 파일 저장
            File finFile = new File(dir, storedFileName);
            file.transferTo(finFile);

            // 저장된 파일명 반환
            return storedFileName;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error ===================" + e.getMessage());
            return null;
        }
    }
	
	// 글 수정 전 조회
	public BoardEditDTO getBoard(Long boardId, String jwtToken) {
		
		Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
	    		.orElseThrow(UnauthorizedException::new);
		
		Board board = boardRepo.findById(boardId)
    	    		.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));
	    
		if(!optAuthenticatedMember.getEmail().equals(board.getMember().getEmail())) {
	    	throw new UnauthorizedException();
	    	
	    }
		
		BoardEditDTO boardDTO = BoardEditDTO.builder()
				.bTitle(board.getBTitle())
				.bContents(board.getBContents())
				.tags(board.getTags())
				.bFileName(frontFilePath + board.getBFileName())
				.bCoverFileName(frontFilePath + board.getBCoverFileName())
				.build();
		
		return boardDTO;
	}
    
    // 글 수정
    public void edit(Long boardId, String bTitle, String bContents, List<String> tags, MultipartFile bFile, MultipartFile bCoverFile, String jwtToken) {

    	Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
    	    		.orElseThrow(UnauthorizedException::new);
    	    
    	Board board = boardRepo.findById(boardId)
    	    		.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));
	    
	    if(!optAuthenticatedMember.getEmail().equals(board.getMember().getEmail())) {
	    	throw new UnauthorizedException();
	    }
	    
	    board.setBTitle(bTitle);
	    board.setBContents(bContents);
	    board.setTags(tags);
	    board.setBFileName(board.getBFileName());
	    board.setBCoverFileName(board.getBCoverFileName());

    	// 파일 저장
	    if(bFile != null && !bFile.isEmpty()) {
	    	String fileName = saveFile(bFile);
	    	board.setBFileName(fileName);
	    } else {
	    	String fileName = saveFile(bFile);
	    	deleteFile(fileName);
	    }
	    if(bCoverFile != null && !bCoverFile.isEmpty()) {
	    	String fileName = saveFile(bCoverFile);
	    	board.setBCoverFileName(fileName);
	    } else {
	    	String fileName = saveFile(bFile);
	    	deleteFile(fileName);
	    }
	    
	    boardRepo.save(board);
    }
    
    // 글 삭제
    public void delete(Long boardId, String jwtToken) {
    	
	    Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
	    		.orElseThrow(UnauthorizedException::new);

	    Board board = boardRepo.findById(boardId)
	    		.orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));
	    
	    if(!optAuthenticatedMember.getEmail().equals(board.getMember().getEmail())) {
	    	throw new UnauthorizedException();
	    }
	    String bFile = board.getBFileName();
	    String bCoverFile = board.getBCoverFileName();
	    
	    if(bFile != null && !bFile.isEmpty()) {
	    	String fileName = board.getBFileName();
	    	deleteFile(fileName);
	    }
	    if(bCoverFile != null && !bCoverFile.isEmpty()) {
	    	String fileName = board.getBCoverFileName();
	    	deleteFile(fileName);
	    }
	    boardRepo.deleteById(boardId);
    }
    
    // 파일 삭제
    public void deleteFile(String fileName) {
    	File file = new File(filePath + fileName);
    	if(file.exists()) {
    		file.delete();
    	}
    }

    //======================== 댓글 ========================
    
    // 댓글 등록
    public CommentResponse createComment(B_commentsDTO commentDTO, Long boardId, String jwtToken) {
	    
    	Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
	    		.orElseThrow(UnauthorizedException::new);
    	
    	Board board = boardRepo.findById(boardId).orElseThrow(() -> new EntityNotFoundException("게시글이 없음"));
    	B_comments comments = B_comments.builder()
    			.bComContent(commentDTO.getCommentContent())
    			.member(optAuthenticatedMember)
    			.board(board)
    			.build();
    	B_comments saveComm = bCommRepo.save(comments);
    	bCommRepo.flush();
    	return new CommentResponse(saveComm.getBComDate());
    }
    
    // 댓글 수정
    public CommentResponse editComment(B_commentsDTO commentDTO, Long commentId, String jwtToken) {
    	
    	Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
    			.orElseThrow(UnauthorizedException::new);
    	
    	B_comments comment = bCommRepo.findById(commentId).orElseThrow(() -> new EntityNotFoundException("댓글이 없음"));
    	if (!optAuthenticatedMember.getEmail().equals(comment.getMember().getEmail())) {
    		throw new UnauthorizedException();
    	}
    	comment.setBComContent(commentDTO.getCommentContent());
    	comment.setBComDate(LocalDateTime.now());
    	B_comments saveComm = bCommRepo.save(comment);
    	bCommRepo.flush();
    	return new CommentResponse(saveComm.getBComDate());
    }
    
    // 댓글 삭제
    public void deleteComment(Long commentId, String jwtToken) {
    	
    	Member optAuthenticatedMember = commonService.getAuthenticatedMember(jwtToken)
    			.orElseThrow(UnauthorizedException::new);
    	
    	B_comments comment = bCommRepo.findById(commentId).orElseThrow(() -> new EntityNotFoundException("댓글이 없음"));
    	
    	if (!optAuthenticatedMember.getEmail().equals(comment.getMember().getEmail())) {
    		throw new UnauthorizedException();
    	}
    	bCommRepo.deleteById(commentId);
    }
    
    //======================== 좋아요 ========================
    
    // 좋아요 확인
    public boolean isUserLiked(String email, Long boardId) {
    	Member member = memberRepo.findOptionalByEmail(email).orElse(null);
    	if(member == null) {
    		return false;
    	} 
    	
    	Board board = boardRepo.findById(boardId).orElse(null);
    	if(board == null) {
    		return false;
    	}
    	
    	Optional<B_like> like = bLikeRepo.findByMemberAndBoard(member, board);
    	return like.isPresent();
    }
  
	// 좋아요 추가
	public void insert(String email, Long boardId) throws Exception {
	    Member member = memberRepo.findOptionalByEmail(email)
	            .orElseThrow(() -> new NotFoundException());

	    Board board = boardRepo.findById(boardId)
	            .orElseThrow(() -> new NotFoundException());

	    B_like like = B_like.builder()
	            .board(board)
	            .member(member)
	            .build();
	    
	    bLikeRepo.save(like);
	}

	// 좋아요 취소
	public void delete(String email, Long boardId) throws NotFoundException {
	    Member member = memberRepo.findOptionalByEmail(email)
	            .orElseThrow(() -> new NotFoundException());

	    Board board = boardRepo.findById(boardId)
	            .orElseThrow(() -> new NotFoundException());

	    B_like like = bLikeRepo.findByMemberAndBoard(member, board)
	            .orElseThrow(() -> new NotFoundException());

	    bLikeRepo.delete(like);
	}

	// 좋아요 수 업데이트
	@Transactional
	public Board updateLike(Long boardId, boolean b) throws NotFoundException {
		int increment = b ? 1 : -1;
	    boardRepo.updateLike(boardId, increment);
	    entityManager.flush();
	    entityManager.clear();
	    Board board = boardRepo.findById(boardId).orElseThrow(NotFoundException::new);
		
	    return board;
	}

	//======================== 조회수 ========================
	
	// 조회수 업데이트
	public int updateCnt(Long boardId) throws NotFoundException {
		boardRepo.updateCnt(boardId);
		Board board = boardRepo.findById(boardId).orElseThrow(NotFoundException::new);
		return board.getBCnt();
	}
}