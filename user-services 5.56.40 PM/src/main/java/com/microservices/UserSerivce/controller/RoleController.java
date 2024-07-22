package com.microservices.UserSerivce.controller;

import com.microservices.UserSerivce.entity.Role;
import com.microservices.UserSerivce.repository.RoleRepository;
import com.microservices.UserSerivce.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/role")
@CrossOrigin("*")
public class RoleController {

    @Autowired
    RoleService roleService;

    @GetMapping()
    public ResponseEntity<List<Role>> getAllRoles(){
        List<Role> roleList = roleService.findAll();
        return new ResponseEntity<>(roleList, HttpStatus.OK);
    }

}
