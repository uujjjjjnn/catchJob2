package com.project.catchJob.dto.board;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class CommentResponse {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private LocalDateTime commentDate;
	
	public CommentResponse(LocalDateTime commentDate) {
		this.commentDate = commentDate;
	}
	
}
