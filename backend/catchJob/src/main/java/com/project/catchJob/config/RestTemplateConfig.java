package com.project.catchJob.config;

import java.nio.charset.Charset;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

	// HTTP get, post 요청을 날릴 때 일정한 형식에 맞춰주는 template
	
	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
		
//		return restTemplateBuilder
//				.requestFactory(() -> new SimpleClientHttpRequestFactory())
//				.additionalMessageConverters(new StringHttpMessageConverter(Charset.forName("UTF-8")))
//				.build();
		
		var factory = new SimpleClientHttpRequestFactory();
		factory.setConnectTimeout(3000);
		factory.setReadTimeout(3000);
		return new RestTemplate(factory);
	}

}