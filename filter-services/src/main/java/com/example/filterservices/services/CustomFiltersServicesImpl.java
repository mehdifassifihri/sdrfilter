package com.example.filterservices.services;

import com.example.filterservices.entities.CustomFilters;
import com.example.filterservices.entities.Filter;
import com.example.filterservices.repositories.CustomFiltersRepository;
import com.example.filterservices.repositories.FilterRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomFiltersServicesImpl implements CustomFiltersServices{

    private CustomFiltersRepository customFiltersRepository;

    private FilterRepository filterRepository;

    @Override
    public List<CustomFilters> getCustomFiltersByUserId(String userId) {
        return customFiltersRepository.getCustomFiltersByUserId(userId);
    }

    @Override
    public CustomFilters addCustomFilters(CustomFilters customFilters) {
        List<Filter> filters = filterRepository.saveAll(customFilters.getFilters());
        customFilters.setFilters(filters);
        return customFiltersRepository.save(customFilters);
    }
}
