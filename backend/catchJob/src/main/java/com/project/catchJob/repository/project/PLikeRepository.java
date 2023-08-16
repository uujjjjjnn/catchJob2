package com.project.catchJob.repository.project;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.catchJob.domain.member.Member;
import com.project.catchJob.domain.project.P_like;
import com.project.catchJob.domain.project.Project;

public interface PLikeRepository extends JpaRepository<P_like, Long> {

	Optional<P_like> findByMemberAndProject(Member member, Project project);
}
