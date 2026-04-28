package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.Match;
import com.renato.sportsapp.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final StandingService standingService;

    public List<Match> findAll(){
        return matchRepository.findAll();
    }

    public Match getById(Long id){
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utakmica sa ID: " + id + " nije pronađena"));
    }

    public List<Match> getByTeam(Long teamId){
        return matchRepository.findByHomeTeamIdOrAwayTeamId(teamId, teamId);
    }

    public List<Match> getByLeague(Long leagueId){
        return matchRepository.findByLeagueId(leagueId);
    }

    public List<Match> getByStatus(String status){
        return matchRepository.findByStatus(status);
    }

    public Match create(Match match){
        Match saved = matchRepository.save(match);
        if (saved.getLeague() != null) {
            standingService.recalculateStandingsForLeague(saved.getLeague().getId());
        }
        return saved;
    }

    public Match update(Long id, Match updatedMatch){
        Match existing = getById(id);
        existing.setLeague(updatedMatch.getLeague());
        existing.setMatchDate(updatedMatch.getMatchDate());
        existing.setAwayScore(updatedMatch.getAwayScore());
        existing.setHomeScore(updatedMatch.getHomeScore());
        existing.setStatus(updatedMatch.getStatus());
        existing.setHomeTeam(updatedMatch.getHomeTeam());
        existing.setAwayTeam(updatedMatch.getAwayTeam());
        Match saved = matchRepository.save(existing);

        if (saved.getLeague() != null) {
            standingService.recalculateStandingsForLeague(saved.getLeague().getId());
        }
        return saved;
    }

    public void delete(Long id){
        Match match = getById(id);
        Long leagueId = match.getLeague() != null ? match.getLeague().getId() : null;
        matchRepository.deleteById(id);
        if (leagueId != null) {
            standingService.recalculateStandingsForLeague(leagueId);
        }
    }
}