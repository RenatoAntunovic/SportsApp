package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.Standing;
import com.renato.sportsapp.repository.StandingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StandingService {

    private final StandingRepository standingRepository;

    public List<Standing> getAll() {
        return standingRepository.findAll();
    }

    public Standing getById(Long id) {
        return standingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Standing not found with id: " + id));
    }

    public List<Standing> getByLeague(Long leagueId) {
        return standingRepository.findByLeagueIdOrderByPositionAsc(leagueId);
    }

    public Standing create(Standing standing) {
        return standingRepository.save(standing);
    }

    public Standing update(Long id, Standing updatedStanding) {
        Standing existing = getById(id);
        existing.setTeam(updatedStanding.getTeam());
        existing.setLeague(updatedStanding.getLeague());
        existing.setPlayed(updatedStanding.getPlayed());
        existing.setWon(updatedStanding.getWon());
        existing.setDrawn(updatedStanding.getDrawn());
        existing.setLost(updatedStanding.getLost());
        existing.setGoalsFor(updatedStanding.getGoalsFor());
        existing.setGoalsAgainst(updatedStanding.getGoalsAgainst());
        existing.setPoints(updatedStanding.getPoints());
        existing.setPosition(updatedStanding.getPosition());
        return standingRepository.save(existing);
    }

    public void delete(Long id) {
        standingRepository.deleteById(id);
    }
}
