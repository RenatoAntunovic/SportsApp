package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TeamRepository extends JpaRepository<Team, Long> {}
