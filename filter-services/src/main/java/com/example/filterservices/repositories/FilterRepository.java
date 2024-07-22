package com.example.filterservices.repositories;

import com.example.filterservices.entities.Filter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilterRepository extends JpaRepository<Filter,Integer> {

}
