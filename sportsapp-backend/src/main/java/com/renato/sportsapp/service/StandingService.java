package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.*;
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

        if (matches.isEmpty()) return;

        SportType sportType = matches.get(0).getLeague().getSport().getType();
        if (sportType == null) sportType = SportType.OTHER;

        System.out.println("=== RECALCULATE ===");
        System.out.println("League ID: " + leagueId);
        System.out.println("Sport: " + matches.get(0).getLeague().getSport().getName());
        System.out.println("Type: " + sportType);

        if (sportType == SportType.TENNIS) return;

        // ... ostatak metode

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

            // Različita logika po tipu sporta
            applyMatchResult(sportType, homeStanding, awayStanding, homeScore, awayScore);
        }

        // Različito sortiranje po tipu sporta
        List<Standing> sorted = sortStandings(sportType, new ArrayList<>(standingsMap.values()));

        for (int i = 0; i < sorted.size(); i++) {
            sorted.get(i).setPosition(i + 1);
        }
        standingRepository.saveAll(sorted);
    }

    private void applyMatchResult(SportType type, Standing home, Standing away, int homeScore, int awayScore) {
        switch (type) {
            case BASKETBALL -> {
                // Košarka: 1 bod za pobjedu, nema nerješeno
                if (homeScore > awayScore) {
                    home.setWon(home.getWon() + 1);
                    home.setPoints(home.getPoints() + 1);
                    away.setLost(away.getLost() + 1);
                } else if (homeScore < awayScore) {
                    away.setWon(away.getWon() + 1);
                    away.setPoints(away.getPoints() + 1);
                    home.setLost(home.getLost() + 1);
                }
                // Ako je nerješeno u košarci, ne računa se (overtime mora odlučiti)
            }
            case HOCKEY -> {
                // Hokej: 2 boda za pobjedu, nerješeno → 1 svakome
                if (homeScore > awayScore) {
                    home.setWon(home.getWon() + 1);
                    home.setPoints(home.getPoints() + 2);
                    away.setLost(away.getLost() + 1);
                } else if (homeScore < awayScore) {
                    away.setWon(away.getWon() + 1);
                    away.setPoints(away.getPoints() + 2);
                    home.setLost(home.getLost() + 1);
                } else {
                    home.setDrawn(home.getDrawn() + 1);
                    away.setDrawn(away.getDrawn() + 1);
                    home.setPoints(home.getPoints() + 1);
                    away.setPoints(away.getPoints() + 1);
                }
            }
            default -> {
                // FOOTBALL i OTHER: standardno 3 za pobjedu, 1 za nerješeno
                if (homeScore > awayScore) {
                    home.setWon(home.getWon() + 1);
                    home.setPoints(home.getPoints() + 3);
                    away.setLost(away.getLost() + 1);
                } else if (homeScore < awayScore) {
                    away.setWon(away.getWon() + 1);
                    away.setPoints(away.getPoints() + 3);
                    home.setLost(home.getLost() + 1);
                } else {
                    home.setDrawn(home.getDrawn() + 1);
                    away.setDrawn(away.getDrawn() + 1);
                    home.setPoints(home.getPoints() + 1);
                    away.setPoints(away.getPoints() + 1);
                }
            }
        }
    }

    private List<Standing> sortStandings(SportType type, List<Standing> standings) {
        if (type == SportType.BASKETBALL) {
            // Košarka: po win percentage, pa po pobjedama
            standings.sort((a, b) -> {
                double pctA = a.getPlayed() > 0 ? (double) a.getWon() / a.getPlayed() : 0;
                double pctB = b.getPlayed() > 0 ? (double) b.getWon() / b.getPlayed() : 0;
                if (pctA != pctB) return Double.compare(pctB, pctA);
                return b.getWon() - a.getWon();
            });
        } else {
            // FOOTBALL, HOCKEY, OTHER: po bodovima, gol razlici, datim golovima
            standings.sort((a, b) -> {
                if (!a.getPoints().equals(b.getPoints())) return b.getPoints() - a.getPoints();
                int gdA = a.getGoalsFor() - a.getGoalsAgainst();
                int gdB = b.getGoalsFor() - b.getGoalsAgainst();
                if (gdA != gdB) return gdB - gdA;
                return b.getGoalsFor() - a.getGoalsFor();
            });
        }
        return standings;
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