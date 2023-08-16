package com.project.catchJob.repository.project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.project.catchJob.domain.project.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

	//@Query("select p from Project p where p.title like CONCAT('%', :keyword, '%')")
	List<Project> findByTitleContaining(String keyword);
	List<Project> findByMemberNameContaining(String keyword);
	
	@Modifying
    @Transactional
    @Query("update Project p set p.pCnt = p.pCnt + 1 where p.projectId = :projectId")
    int updateCnt(@Param("projectId")Long projectId);
	
	@Modifying
	@Transactional
	@Query("update Project p set p.pLike = p.pLike + :increment where p.projectId = :projectId")
	int updateLike(@Param("projectId") Long boardId, @Param("increment") int increment);
}
