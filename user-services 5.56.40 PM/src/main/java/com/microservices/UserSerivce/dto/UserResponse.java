package com.microservices.UserSerivce.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private int id;

    private String nom;

    private String prenom;

    private String email;

    private String password;

    private String username;



}
