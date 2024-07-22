package com.microservices.UserSerivce.RequestResponse;

import com.microservices.UserSerivce.dto.UserResponse;
import com.microservices.UserSerivce.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Response {
    private User user;
    private String accesstoken;



}