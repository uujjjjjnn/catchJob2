package com.project.catchJob.repository.board;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.catchJob.domain.board.B_like;
import com.project.catchJob.domain.board.Board;
import com.project.catchJob.domain.member.Member;

public interface B_likeRepository extends JpaRepository<B_like, Long> {

	Optional<B_like> findByMemberAndBoard(Member member, Board board);
}
