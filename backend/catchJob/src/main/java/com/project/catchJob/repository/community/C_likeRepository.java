package com.project.catchJob.repository.community;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.catchJob.domain.community.C_like;
import com.project.catchJob.domain.community.Community;
import com.project.catchJob.domain.member.Member;

@Repository
public interface C_likeRepository extends JpaRepository<C_like, Long>{

	Optional<C_like> findByMemberAndCommunity(Member member, Community community);


}
