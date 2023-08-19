//package com.project.catchJob.domain.chat;
//
//import java.time.LocalDateTime;
//
//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.FetchType;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
//import javax.persistence.Id;
//import javax.persistence.JoinColumn;
//import javax.persistence.ManyToOne;
//
//import org.hibernate.annotations.CreationTimestamp;
//
//import com.project.catchJob.domain.member.Member;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@Data
//@Entity
//public class Chat {
//	
//    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long chatId;
//	
//    private String content;
//	
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "sender_id")
//    private Member sender;
//	
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "receiver_id")
//    private Member receiver;
//	
//    @CreationTimestamp
//    @Column(nullable = false, updatable = false)
//    private LocalDateTime time;
//}
