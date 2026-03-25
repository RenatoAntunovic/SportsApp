package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeagueRepository extends JpaRepository<League, Long> {
    List<League> findBySportId(Long sportId);
}
