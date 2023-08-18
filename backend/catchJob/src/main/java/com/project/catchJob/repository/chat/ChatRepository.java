package com.project.catchJob.repository.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.catchJob.domain.chat.Chat;
import com.project.catchJob.domain.member.Member;

public interface ChatRepository extends JpaRepository<Chat, Long> {

	List<Chat> findBySenderOrReceiver(Member sender, Member receiver);
}
