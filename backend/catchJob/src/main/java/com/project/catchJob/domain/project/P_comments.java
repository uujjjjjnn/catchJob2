package com.project.catchJob.domain.project;

import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.catchJob.domain.board.Board;
import com.project.catchJob.domain.member.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@ToString(exclude = {"member", "project"})
@Entity
public class P_comments {

	@Id @GeneratedValue
	private Long pComId; // 프로젝트댓글 아이디
	
	private String pComContent; // 댓글 내용
	
	@CreationTimestamp
	@Column(insertable = false, updatable = false)
	private LocalDateTime pComDate; // 댓글 작성날짜
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false, updatable = false)
	private Member member;
	
	public void setMember(Member member) {
		this.member = member;
		member.getP_CommentsList().add(this);
	}
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "project_id", nullable = false, updatable = false)
	private Project project;
	
	public void setProject(Project project) {
		this.project = project;
		project.getProjectCommentsList().add(this);
	}	
}