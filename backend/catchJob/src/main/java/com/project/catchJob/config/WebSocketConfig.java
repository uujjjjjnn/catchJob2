package com.project.catchJob.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	// 참고 : https://hyeon9mak.github.io/spring-web-socket/
	
	@Override // 메시지 브로커에 관련된 설정
	public void configureMessageBroker(MessageBrokerRegistry registry) {

		registry.enableSimpleBroker("/topic");
		registry.setApplicationDestinationPrefixes("/ws");
		// 대상 헤더가 시작되는 STOMP 메세지는 해당 클래스의 메서드로 라우팅
	}
	
	@Override // SocketJs Fallback을 이용해 노출할 STOMP endpoint 설정
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		
		registry.addEndpoint("/studyDetail/applyList") // 웹 소켓 생성 및 연결
		.withSockJS(); // 웹소켓을 지원하지 않는 브라우저도 연결 가능하도록 설정
	}
}
