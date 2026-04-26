package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.League;
import com.renato.sportsapp.entity.Team;
import com.renato.sportsapp.entity.User;
import com.renato.sportsapp.repository.LeagueRepository;
import com.renato.sportsapp.repository.TeamRepository;
import com.renato.sportsapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final LeagueRepository leagueRepository;

    public Set<Team> getFavoriteTeams(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavoriteTeams();
    }

    public Set<League> getFavoriteLeagues(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavoriteLeagues();
    }

    @Transactional
    public void toggleTeam(String email, Long teamId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (user.getFavoriteTeams().contains(team)) {
            user.getFavoriteTeams().remove(team);
        } else {
            user.getFavoriteTeams().add(team);
        }
        userRepository.save(user);
    }

    @Transactional
    public void toggleLeague(String email, Long leagueId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        if (user.getFavoriteLeagues().contains(league)) {
            user.getFavoriteLeagues().remove(league);
        } else {
            user.getFavoriteLeagues().add(league);
        }
        userRepository.save(user);
    }
}