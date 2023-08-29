package com.project.catchJob.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.project.catchJob.dto.member.MemberDTO;

public class MapController {

	@PostMapping("/map")
	public ResponseEntity<?> map() {
		
		return ResponseEntity.ok().body(null);
	}
}
