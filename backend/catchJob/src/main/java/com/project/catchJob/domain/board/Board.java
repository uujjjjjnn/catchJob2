package com.project.catchJob.domain.board;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Transient;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@ToString(exclude = {"member","boardCommentsList", "boardLikeList", "boardTagList"})
@Entity
public class Board {
	
	@Id @GeneratedValue @Column(name = "board_id")
	private Long boardId;
	
	private String bTitle;
	
	@Lob
	private String bContents; // editor사용(대용량)
	
	@Column(insertable = false, columnDefinition = "bigint default 0")
	private int bCnt; // 조회수
	
	@Column(insertable = false, columnDefinition = "bigint default 0")
	private int bLike; // 좋아요갯수
	
	@ElementCollection
	private List<String> tags; // 태그
	
	private String bFileName; // 파일명
	
	@Transient // DB에 저장 안 됨
	private MultipartFile bFileUrl; // 실제경로
	
	private String bCoverFileName; // 커버(썸네일) 파일명
	
	@Transient // DB에 저장 안 됨
	private MultipartFile bCoverFileUrl; // 커버(썸네일) 실제경로
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	@Column(insertable = false, updatable = false, columnDefinition = "date default now()")
	private Date bDate; // 작성날짜
	
	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false, updatable = false)
	@JsonIgnore
	private Member member;
	
	public void setMember(Member member) {
		this.member = member;
		member.getBoardList().add(this);
	}
	
	public void removeBFile() {
		this.bFileName = null;
	}
	
	public void removeBCoverFile() {
		this.bCoverFileName = null;
	}
	
	@JsonIgnore
	@Builder.Default // 이 녀석이 없으면 lombok의 builder로 객체를 생성할 때 List가 선언한대로 제대로 초기화되지 않는다.
	@OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("bComId DESC")
	private List<B_comments> boardCommentsList = new ArrayList<>();
	
	@JsonIgnore
	@Builder.Default // 이 녀석이 없으면 lombok의 builder로 객체를 생성할 때 List가 선언한대로 제대로 초기화되지 않는다.
	@OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<B_like> boardLikeList = new ArrayList<>();
	
//	@OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
//	private List<B_tag> boardTagList = new ArrayList<>();

}