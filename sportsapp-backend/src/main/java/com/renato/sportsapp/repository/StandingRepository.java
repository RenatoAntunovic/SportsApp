package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Standing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StandingRepository extends JpaRepository<Standing, Long> {
    List<Standing> findByLeagueIdOrderByPositionAsc(Long leagueId);
}
