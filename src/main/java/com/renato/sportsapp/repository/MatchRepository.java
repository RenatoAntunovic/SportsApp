package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MatchRepository extends JpaRepository<Match, Long> {}
