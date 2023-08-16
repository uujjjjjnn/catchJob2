package com.project.catchJob.domain.community;

import java.time.LocalDateTime;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
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
@Entity
@ToString(exclude = {"member", "community"})
public class C_comments {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="c_com_id")
    private long cComId; //댓글식별자

    @Column(name="c_comcontent")
    private String cComcontent; //내용

    
    @CreationTimestamp
	@Column(name="c_com_date",nullable = false, updatable = false)
	private LocalDateTime cComDate; 
    
    
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "communityId")
	@JsonIdentityReference(alwaysAsId = true)
    @ManyToOne
    @JoinColumn(name = "community_id")
    private Community community;
    
    public void setCommunity(Community community) {
		this.community = community;
		community.getCommunityCommentsList().add(this);
	}
    
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "memberId")
	@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    public void setMember(Member member) {

		this.member = member;
		member.getC_CommentsList().add(this);
	}


    
}
