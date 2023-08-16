package com.project.catchJob.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 (또는 필요한 경로만)
//                .allowedOrigins("http://localhost:3000") // 클라이언트의 도메인을 허용합니다.
                .allowedOriginPatterns("*") // 클라이언트의 도메인을 허용합니다.
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드를 지정합니다.
                .allowCredentials(true)
                .allowedHeaders("*"); // 허용할 헤더를 지정하거나, "*"로 허용할 수 있습니다.
//                .maxAge(3600); // 허용할 request header의 최대 시간을 설정합니다.
    }
}
