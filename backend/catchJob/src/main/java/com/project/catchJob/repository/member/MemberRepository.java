package com.project.catchJob.repository.member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.catchJob.domain.member.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

	Boolean existsByEmail(String email);
	Member findByEmail(String email);
	Optional<Member> findOptionalByEmail(String email);
	
//	@Query("select m from Member m where m.name like %:keyword% ")
//	@Query("select m from Member m where m.name like CONCAT('%', :keyword, '%')")
//	List<Member> findAllByName(@Param("keyword") String keyword);

	List<Member> findByNameContaining(String keyword);

}
