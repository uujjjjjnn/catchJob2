package com.project.catchJob.domain.board;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.catchJob.domain.member.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@ToString(exclude = {"member", "board"})
@Entity
public class B_like {

	@Id @GeneratedValue
	private Long bLikId; // 보드좋아요 아이디
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false, updatable = false)
	private Member member;
	
	public void setMember(Member member) {
		this.member = member;
		member.getB_LikeList().add(this);
	}
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "board_id", nullable = false, updatable = false)
	private Board board;
	
	public void setBoard(Board board) {
		this.board = board;
		board.getBoardLikeList().add(this);
	}
	
	
}