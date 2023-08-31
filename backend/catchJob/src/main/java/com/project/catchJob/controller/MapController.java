package com.project.catchJob.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class MapController {

	@GetMapping("/map")
    public String getPlaces(@RequestParam Double lat, @RequestParam Double lng) {
        final String uri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json" +
            "?location=" + lat + "," + lng +
            "&radius=1000" +
            "&type=카페" +
            "&keyword=스터디 카페" +
            "&key=AIzaSyDyCBaHuD_xiJCzf_EH1Q_0R5WRaiA0LiM"; // 구글 api키

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(uri , String.class);

        return response.getBody();
    }
}
