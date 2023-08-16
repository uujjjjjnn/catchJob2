package com.project.catchJob.domain.community;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.catchJob.domain.member.Member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@ToString(exclude = {"member", "community"})
public class C_like {
    @Id
    @GeneratedValue
    private Long cLikeId;

    @JsonIgnore
	@ManyToOne
    @JoinColumn(name = "community_id", nullable = false, updatable = false)
    private Community community;
    
    public void setCommunity(Community community) {
		this.community =community;
		community.getCommunityLikeList().add(this);
	}
    
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "member_id",nullable = false, updatable = false) 
    private Member member;

    public void setMember(Member member) {
		this.member = member;
		member.getC_LikeList().add(this);
	}
   

}
