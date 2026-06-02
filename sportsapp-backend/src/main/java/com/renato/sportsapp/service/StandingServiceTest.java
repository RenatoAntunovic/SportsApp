package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.*;
import com.renato.sportsapp.repository.MatchRepository;
import com.renato.sportsapp.repository.StandingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class StandingServiceTest {

    @Mock
    private StandingRepository standingRepository;

    @Mock
    private MatchRepository matchRepository;

    @InjectMocks
    private StandingService standingService;

    private Team homeTeam;
    private Team awayTeam;
    private League league;
    private Sport sport;

    @BeforeEach
    void setUp() {
        homeTeam = new Team();
        homeTeam.setId(1L);
        homeTeam.setName("Home Team");

        awayTeam = new Team();
        awayTeam.setId(2L);
        awayTeam.setName("Away Team");

        sport = new Sport();
        sport.setId(1L);
        sport.setName("Fudbal");
        sport.setType(SportType.FOOTBALL);

        league = new League();
        league.setId(1L);
        league.setName("Test League");
        league.setSport(sport);
    }

    private Match createMatch(Team home, Team away, int homeScore, int awayScore) {
        Match match = new Match();
        match.setHomeTeam(home);
        match.setAwayTeam(away);
        match.setHomeScore(homeScore);
        match.setAwayScore(awayScore);
        match.setStatus("FINISHED");
        match.setLeague(league);
        return match;
    }

    // ============================================
    //testovi za fudbal
    // ============================================

    @Test
    @DisplayName("Football: Home win gives 3 points to home team")
    void football_homeWin_gives3Points() {
        Match match = createMatch(homeTeam, awayTeam, 2, 0);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream()
                    .filter(s -> s.getTeam().getId() == 1L)
                    .findFirst().orElseThrow();
            return home.getPoints() == 3 && home.getWon() == 1 && home.getLost() == 0;
        }));
    }

    @Test
    @DisplayName("Football: Away win gives 3 points to away team")
    void football_awayWin_gives3Points() {
        Match match = createMatch(homeTeam, awayTeam, 0, 2);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing away = list.stream()
                    .filter(s -> s.getTeam().getId() == 2L)
                    .findFirst().orElseThrow();
            return away.getPoints() == 3 && away.getWon() == 1;
        }));
    }

    @Test
    @DisplayName("Football: Draw gives 1 point to each team")
    void football_draw_gives1PointEach() {
        Match match = createMatch(homeTeam, awayTeam, 1, 1);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            Standing away = list.stream().filter(s -> s.getTeam().getId() == 2L).findFirst().orElseThrow();
            return home.getPoints() == 1 && home.getDrawn() == 1
                    && away.getPoints() == 1 && away.getDrawn() == 1;
        }));
    }

    @Test
    @DisplayName("Football: Goals are tracked correctly")
    void football_goalsTrackedCorrectly() {
        Match match = createMatch(homeTeam, awayTeam, 3, 1);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            return home.getGoalsFor() == 3 && home.getGoalsAgainst() == 1;
        }));
    }

    @Test
    @DisplayName("Football: Teams sorted by points descending")
    void football_teamsSortedByPoints() {
        Match win = createMatch(homeTeam, awayTeam, 2, 0);
        Match draw = createMatch(awayTeam, homeTeam, 1, 1);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(win, draw));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            list.sort((a, b) -> a.getPosition() - b.getPosition());
            return list.get(0).getTeam().getId() == 1L; // home team should be first
        }));
    }

    // ============================================
    // testovi košarka
    // ============================================

    @Test
    @DisplayName("Basketball: Win gives 1 point, no draws")
    void basketball_win_gives1Point() {
        sport.setType(SportType.BASKETBALL);
        Match match = createMatch(homeTeam, awayTeam, 110, 95);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            return home.getPoints() == 1 && home.getWon() == 1;
        }));
    }

    @Test
    @DisplayName("Basketball: Loss gives 0 points")
    void basketball_loss_gives0Points() {
        sport.setType(SportType.BASKETBALL);
        Match match = createMatch(homeTeam, awayTeam, 90, 110);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            return home.getPoints() == 0 && home.getLost() == 1;
        }));
    }

    // ============================================
    // testovi hokej
    // ============================================

    @Test
    @DisplayName("Hockey: Win gives 2 points")
    void hockey_win_gives2Points() {
        sport.setType(SportType.HOCKEY);
        Match match = createMatch(homeTeam, awayTeam, 4, 2);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            return home.getPoints() == 2 && home.getWon() == 1;
        }));
    }

    @Test
    @DisplayName("Hockey: Draw gives 1 point each")
    void hockey_draw_gives1PointEach() {
        sport.setType(SportType.HOCKEY);
        Match match = createMatch(homeTeam, awayTeam, 2, 2);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            Standing away = list.stream().filter(s -> s.getTeam().getId() == 2L).findFirst().orElseThrow();
            return home.getPoints() == 1 && home.getDrawn() == 1
                    && away.getPoints() == 1 && away.getDrawn() == 1;
        }));
    }

    // ============================================
    // edge case testovi
    // ============================================

    @Test
    @DisplayName("Tennis: No standings generated")
    void tennis_noStandingsGenerated() {
        sport.setType(SportType.TENNIS);
        Match match = createMatch(homeTeam, awayTeam, 3, 0);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository, never()).saveAll(any());
    }

    @Test
    @DisplayName("Empty league: No standings generated")
    void emptyLeague_noStandingsGenerated() {
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of());

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository, never()).saveAll(any());
    }

    @Test
    @DisplayName("Match with null score is skipped")
    void matchWithNullScore_isSkipped() {
        Match match = new Match();
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setHomeScore(null);
        match.setAwayScore(null);
        match.setStatus("FINISHED");
        match.setLeague(league);

        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            return list.isEmpty();
        }));
    }

    @Test
    @DisplayName("Multiple matches: Played count is correct")
    void multipleMatches_playedCountCorrect() {
        Match match1 = createMatch(homeTeam, awayTeam, 2, 1);
        Match match2 = createMatch(awayTeam, homeTeam, 1, 0);
        when(matchRepository.findByLeagueId(1L)).thenReturn(List.of(match1, match2));

        standingService.recalculateStandingsForLeague(1L);

        verify(standingRepository).saveAll(argThat(standings -> {
            List<Standing> list = (List<Standing>) standings;
            Standing home = list.stream().filter(s -> s.getTeam().getId() == 1L).findFirst().orElseThrow();
            return home.getPlayed() == 2;
        }));
    }
}