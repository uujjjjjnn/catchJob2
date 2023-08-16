package com.project.catchJob.domain.project;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.catchJob.domain.member.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = {"member", "project"})
@Entity
public class P_member {

	@Id @GeneratedValue
	private Long pMemId; // 프로젝트모집인원 아이디
	
	private String job; // 직무
	
	private String reason; // 사유
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "project_id", referencedColumnName = "project_id", nullable = false, updatable = false)
	private Project project;
	
	public void setProject(Project project) {
		this.project = project;
		project.getProjectMemberList().add(this);
	}
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false, updatable = false)
	private Member member;
	
	public void setMember(Member member) {
		this.member = member;
		member.getP_MemberList().add(this);
	}

}
