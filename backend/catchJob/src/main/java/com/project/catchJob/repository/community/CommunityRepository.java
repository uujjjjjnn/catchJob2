package com.project.catchJob.repository.community;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project.catchJob.domain.community.C_comments;
import com.project.catchJob.domain.community.Community;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long>{

//   List<Community> findByTitleContaining(String keyword);
//   List<Community> findByMemberNameContaining(String keyword);
//   Collection<? extends Object> findByMemberContaining(String keyword);
   
	@Modifying
	@Transactional
	@Query("update Community c set c.cLike = c.cLike + :increment where c.communityId = :communityId")
	int updateLike(@Param("communityId") Long communityId, @Param("increment") int increment);
   
}