package com.project.catchJob.domain.community;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.project.catchJob.domain.member.Member;
import com.project.catchJob.dto.community.CommunityDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"member", "communityCommentsList", "communityLikeList"})
@Entity
public class Community {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "community_id")
    private long communityId;

    @Column(name = "c_type")
    private String cType;
    
    @Lob
    @Column(name = "c_contents")
    private String cContents;
    
    @Column(name = "c_title")
    private String title;
    
    @Column(name = "c_date",nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime cDate;

    @Column(name ="c_like",insertable = false, columnDefinition = "bigint default 0")
    private int cLike;   
   
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "memberId")
	@JsonIdentityReference(alwaysAsId = true) // id로만 serialize
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    
    public void setMember(Member member) {
		this.member = member;
		member.getCommunityList().add(this);
	}
    
    @JsonIgnore
	@OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<C_comments> communityCommentsList = new ArrayList<>();
	
	@JsonIgnore
	@OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<C_like> communityLikeList = new ArrayList<>();

}
