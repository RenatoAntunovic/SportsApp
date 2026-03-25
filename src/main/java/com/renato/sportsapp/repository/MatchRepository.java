package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByLeagueId(Long leagueId);

    List<Match> findByStatus(String status);

    List<Match> findByHomeTeamOrAwayTeamId(Long homeTeamId, Long awayTeamId);
}
