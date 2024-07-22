package com.example.filterservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class FilterServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(FilterServicesApplication.class, args);
	}

}
