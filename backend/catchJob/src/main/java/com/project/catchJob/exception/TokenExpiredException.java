package com.project.catchJob.exception;

public class TokenExpiredException extends RuntimeException {

	public TokenExpiredException(String message) {
		super(message);
	}
}
