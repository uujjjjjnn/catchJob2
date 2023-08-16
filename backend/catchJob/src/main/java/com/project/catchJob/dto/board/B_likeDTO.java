package com.project.catchJob.dto.board;

import lombok.Getter;

@Getter
public class B_likeDTO {

	private Long memberId;
	private Long boardId;
	
	public B_likeDTO(Long memberId, Long boardId) {
		this.memberId = memberId;
		this.boardId = boardId;
	}

	public B_likeDTO() {}
	
	
	
}
