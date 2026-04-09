package com.renato.sportsapp.config;

import com.renato.sportsapp.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sports/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/leagues/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/sports/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/sports/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/sports/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/leagues/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/leagues/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/leagues/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/teams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/teams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/teams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/players/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/players/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/players/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/matches/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/matches/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/matches/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/standings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/standings/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/standings/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}