package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LeagueRepository extends JpaRepository<League, Long> {}
