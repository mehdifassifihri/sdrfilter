package com.example.filterservices.services;

import com.example.filterservices.entities.CustomFilters;

import java.util.List;

public interface CustomFiltersServices {
    List<CustomFilters> getCustomFiltersByUserId(String userId);

    CustomFilters addCustomFilters(CustomFilters customFilters);
}
