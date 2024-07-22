package com.example.filterservices.repositories;

import com.example.filterservices.entities.CustomFilters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomFiltersRepository extends JpaRepository<CustomFilters,Integer> {
    List<CustomFilters> getCustomFiltersByUserId(String userId);
}
