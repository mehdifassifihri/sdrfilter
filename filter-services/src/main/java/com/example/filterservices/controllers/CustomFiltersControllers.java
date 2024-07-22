package com.example.filterservices.controllers;
import com.example.filterservices.entities.CustomFilters;
import com.example.filterservices.services.CustomFiltersServicesImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filters")
@AllArgsConstructor
@CrossOrigin()
public class CustomFiltersControllers {

    CustomFiltersServicesImpl customFiltersServices;

    @GetMapping("/{userId}")
    ResponseEntity<List<CustomFilters>> getFiltersByUserId(@PathVariable String userId){
        List<CustomFilters> filtersByUserId = customFiltersServices.getCustomFiltersByUserId(userId);
        return ResponseEntity.ok(filtersByUserId);
    }

    @PostMapping()
    public ResponseEntity<CustomFilters> addCustomFilter(@RequestBody CustomFilters customFilters) {
        CustomFilters customFilters1 = customFiltersServices.addCustomFilters(customFilters);
        return new ResponseEntity<>(customFilters1, HttpStatus.CREATED);
    }

}
