package com.project.catchJob.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@PropertySource("classpath:application-naver.properties")
public class NewsController {

	@Value("${naver.api.id}")
    private String naverApiId;

    @Value("${naver.api.secret}")
    private String naverApiSecret;

    @GetMapping("/news")
    public String getNews(@RequestParam String searchWord) {
        final String uri = "https://openapi.naver.com/v1/search/news.json?query=" + searchWord.trim() + "&display=100&sort=sim";

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Naver-Client-Id", naverApiId);
        headers.add("X-Naver-Client-Secret", naverApiSecret);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();
        
        return restTemplate.exchange(uri, HttpMethod.GET, entity, String.class).getBody();
    }
}
