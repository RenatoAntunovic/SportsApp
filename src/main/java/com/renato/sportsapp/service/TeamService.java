package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.Team;
import com.renato.sportsapp.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<Team> getAll() {
        return teamRepository.findAll();
    }

    public Team getById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tim sa ID: "+id+" nije pronađen"));
    }

    public List<Team> getByLeague(Long leagueId) {
        return teamRepository.findByLeagueId(leagueId);
    }

    public List<Team> getBySport(Long sportId) {
        return teamRepository.findBySportId(sportId);
    }

    public Team create(Team team) {
        return teamRepository.save(team);
    }

    public Team update(Long id, Team updatedTeam) {
        Team existing = getById(id);
        existing.setName(updatedTeam.getName());
        existing.setLogoUrl(updatedTeam.getLogoUrl());
        existing.setCountry(updatedTeam.getCountry());
        existing.setLeague(updatedTeam.getLeague());
        existing.setSport(updatedTeam.getSport());
        return teamRepository.save(existing);
    }

    public void delete(Long id) {
        teamRepository.deleteById(id);
    }
}
