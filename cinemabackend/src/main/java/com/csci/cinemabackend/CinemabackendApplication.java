package com.csci.cinemabackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.csci.cinemabackend.repository.MovieRepository;

@SpringBootApplication
public class CinemabackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CinemabackendApplication.class, args);
	}

	@Bean
	CommandLineRunner test(MovieRepository movieRepository) {
		return args -> {
			System.out.println("Currently Running Movies in database:");

			movieRepository.findByStatus("Currently Running")
					.forEach(System.out::println);
		};
	}

}
