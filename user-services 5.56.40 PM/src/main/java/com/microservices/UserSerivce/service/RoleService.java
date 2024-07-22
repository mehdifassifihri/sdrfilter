package com.microservices.UserSerivce.service;

import com.microservices.UserSerivce.dao.Dao;
import com.microservices.UserSerivce.entity.Role;
import com.microservices.UserSerivce.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RoleService implements Dao<Role> {

    @Autowired
    RoleRepository roleRepository;
    @Override
    public Role add(Role o) {
        return null;
    }

    @Override
    public Role update(int id, Role o) {
        return null;
    }

    @Override
    public Role delete(int id) {
        return null;
    }

    @Override
    public Role findById(int id) {
        return null;
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }
}
