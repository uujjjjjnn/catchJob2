package com.project.catchJob.repository.community;



import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.catchJob.domain.community.C_comments;


@Repository
public interface C_commentsRepository extends JpaRepository<C_comments,Long>{
   
   List<C_comments> findAllByCommunity_CommunityId(Long communityId);

}
