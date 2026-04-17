package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.Match;
import com.renato.sportsapp.entity.Team;
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
        return  matchRepository.findAll();
    }

    public Match getById(Long id){
        return  matchRepository.findById(id).orElseThrow(()->new RuntimeException("Utakmica sa ID: "+id+" nije pronađena"));
    }

    public List<Match> getByTeam(Long teamId){
        return matchRepository.findByHomeTeamIdOrAwayTeamId(teamId,teamId);
    }

    public List<Match> getByLeague(Long leagueId){
        return matchRepository.findByLeagueId(leagueId);
    }

    public List<Match> getByStatus(String status){
        return matchRepository.findByStatus(status);
    }

    public Match create(Match match){
        Match saved = matchRepository.save(match);
        System.out.println("=== MATCH CREATED ===");
        System.out.println("League: " + (saved.getLeague() != null ? saved.getLeague().getId() : "NULL"));
        System.out.println("Status: " + saved.getStatus());

        if (saved.getLeague() != null) {
            System.out.println("Radi...");
            standingService.recalculateStandingsForLeague(saved.getLeague().getId());
            System.out.println("Radi sve");
        }
        return saved;
    }

    public Match update(Long id, Match updatedMatch){
        Match existing = getById(id);
        existing.setLeague(updatedMatch.getLeague());
        existing.setMatchDate(updatedMatch.getMatchDate());
        existing.setAwayScore(updatedMatch.getAwayScore());
        existing.setHomeScore(updatedMatch.getHomeScore());
        existing.setLeague(updatedMatch.getLeague());
        existing.setStatus(updatedMatch.getStatus());
        existing.setHomeTeam(updatedMatch.getHomeTeam());
        existing.setAwayTeam(updatedMatch.getAwayTeam());
        return matchRepository.save(existing);
    }

    public void delete(Long id){
        matchRepository.deleteById(id);
    }
}
