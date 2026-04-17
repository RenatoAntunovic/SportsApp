package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Standing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StandingRepository extends JpaRepository<Standing, Long> {
    List<Standing> findByLeagueIdOrderByPositionAsc(Long leagueId);

    Optional<Standing> findByTeamIdAndLeagueId(Long teamId, Long leagueId);

    // Obriši sve standings za određenu ligu (koristimo za regeneraciju)
    void deleteByLeagueId(Long leagueId);
}
