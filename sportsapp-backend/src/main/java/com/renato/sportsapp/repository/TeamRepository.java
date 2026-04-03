package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByLeagueId(Long leagueId);
    List<Team> findBySportId(Long sportId);

}
