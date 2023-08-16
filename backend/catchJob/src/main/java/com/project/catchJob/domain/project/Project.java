package com.project.catchJob.domain.project;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyColumn;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.project.catchJob.converter.CrewConverter;
import com.project.catchJob.converter.PlatformConverter;
import com.project.catchJob.domain.member.Member;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(exclude = {"member", "projectCommentsList", "projectLikeList", "projectReasonList", "projectMemberList"})
@Entity
public class Project {

	@Id @GeneratedValue @Column(name = "project_id")
	private Long projectId;
	
	private String type; // 분야
	
	private String title;
	
	private String field;
	
	private String loc; // 지역
	
	private String term; // 모집기간
	
	@Column(columnDefinition="BOOLEAN DEFAULT false")
	private boolean end; // 완료여부
	
	@Lob
	@Column(length=50000)
	private String detail;
	
//	@ElementCollection
//    @CollectionTable(name = "crew_counts", joinColumns = @JoinColumn(name = "project_id"))
//    @MapKeyColumn(name = "role")
//    @Column(name = "count")
	@Convert(converter=CrewConverter.class)
    private Map<String, Integer> crew;
	
	// private String platform; // 출시플랫폼
	
//	@ElementCollection(fetch = FetchType.EAGER)
//	@CollectionTable(name = "platforms", joinColumns = @JoinColumn(name = "project_id"))
//	@Column(name = "platform")
	@Convert(converter=PlatformConverter.class)
	private List<String> platforms;

	
	@Column(insertable = false, updatable = false, columnDefinition = "bigint default 0")
	private int pCnt; // 조회수
	
	@Column(insertable = false, updatable = false, columnDefinition = "bigint default 0")
	private int pLike; // 좋아요갯수
	
	@Column(insertable = false, updatable = false, columnDefinition = "date default now()")
	private Date pDate; // 작성날짜
	
//	@JsonIgnore
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "member_id", nullable = false, updatable = false)
	@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "memberId")
	@JsonIdentityReference(alwaysAsId = true) // id로만 serialize
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;
	
	public void setMember(Member member) {
		this.member = member;
		member.getProjectList().add(this);
	}

	@JsonIgnore
	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<P_comments> projectCommentsList = new ArrayList<>();
	
	@JsonIgnore
	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<P_like> projectLikeList = new ArrayList<>();	
	
	@JsonIgnore
	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<P_member> projectMemberList = new ArrayList<>();	
}