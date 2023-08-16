package com.project.catchJob.repository.project;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.catchJob.domain.project.P_member;

public interface P_memberRepository extends JpaRepository<P_member, Long> {

	@Query("SELECT p FROM P_member p WHERE p.project.id = :projectId AND p.job = :job")
	List<P_member> findByProjectIdAndJob(@Param("projectId") Long projectId, @Param("job") String job);

}
