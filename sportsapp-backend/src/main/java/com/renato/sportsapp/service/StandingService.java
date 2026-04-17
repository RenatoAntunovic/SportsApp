package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.League;
import com.renato.sportsapp.entity.Match;
import com.renato.sportsapp.entity.Standing;
import com.renato.sportsapp.entity.Team;
import com.renato.sportsapp.repository.MatchRepository;
import com.renato.sportsapp.repository.StandingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class StandingService {

    private final StandingRepository standingRepository;
    private final MatchRepository matchRepository;

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

    @Transactional
    public void recalculateStandingsForLeague(Long leagueId) {
        standingRepository.deleteByLeagueId(leagueId);

        List<Match> matches = matchRepository.findByLeagueId(leagueId).stream()
                .filter(m -> "FINISHED".equals(m.getStatus()))
                .toList();

        Map<Long, Standing> standingsMap = new HashMap<>();

        for (Match match : matches) {
            Team home = match.getHomeTeam();
            Team away = match.getAwayTeam();
            Integer homeScore = match.getHomeScore();
            Integer awayScore = match.getAwayScore();

            if (home == null || away == null || homeScore == null || awayScore == null) continue;

            Standing homeStanding = standingsMap.computeIfAbsent(home.getId(),
                    id -> createEmptyStanding(home, match.getLeague()));
            Standing awayStanding = standingsMap.computeIfAbsent(away.getId(),
                    id -> createEmptyStanding(away, match.getLeague()));

            homeStanding.setPlayed(homeStanding.getPlayed() + 1);
            awayStanding.setPlayed(awayStanding.getPlayed() + 1);

            homeStanding.setGoalsFor(homeStanding.getGoalsFor() + homeScore);
            homeStanding.setGoalsAgainst(homeStanding.getGoalsAgainst() + awayScore);
            awayStanding.setGoalsFor(awayStanding.getGoalsFor() + awayScore);
            awayStanding.setGoalsAgainst(awayStanding.getGoalsAgainst() + homeScore);

            if (homeScore > awayScore) {
                homeStanding.setWon(homeStanding.getWon() + 1);
                homeStanding.setPoints(homeStanding.getPoints() + 3);
                awayStanding.setLost(awayStanding.getLost() + 1);
            } else if (homeScore < awayScore) {
                awayStanding.setWon(awayStanding.getWon() + 1);
                awayStanding.setPoints(awayStanding.getPoints() + 3);
                homeStanding.setLost(homeStanding.getLost() + 1);
            } else {
                homeStanding.setDrawn(homeStanding.getDrawn() + 1);
                awayStanding.setDrawn(awayStanding.getDrawn() + 1);
                homeStanding.setPoints(homeStanding.getPoints() + 1);
                awayStanding.setPoints(awayStanding.getPoints() + 1);
            }
        }

        List<Standing> sorted = new ArrayList<>(standingsMap.values());
        sorted.sort((a, b) -> {
            if (!a.getPoints().equals(b.getPoints())) return b.getPoints() - a.getPoints();
            int gdA = a.getGoalsFor() - a.getGoalsAgainst();
            int gdB = b.getGoalsFor() - b.getGoalsAgainst();
            if (gdA != gdB) return gdB - gdA;
            return b.getGoalsFor() - a.getGoalsFor();
        });

        for (int i = 0; i < sorted.size(); i++) {
            sorted.get(i).setPosition(i + 1);
        }
        standingRepository.saveAll(sorted);
    }

    private Standing createEmptyStanding(Team team, League league) {
        Standing s = new Standing();
        s.setTeam(team);
        s.setLeague(league);
        s.setPlayed(0);
        s.setWon(0);
        s.setDrawn(0);
        s.setLost(0);
        s.setGoalsFor(0);
        s.setGoalsAgainst(0);
        s.setPoints(0);
        s.setPosition(0);
        return s;
    }
}