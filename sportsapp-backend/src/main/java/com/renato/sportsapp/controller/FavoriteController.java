package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.League;
import com.renato.sportsapp.entity.Team;
import com.renato.sportsapp.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping("/teams")
    public Set<Team> getFavoriteTeams(Authentication auth) {
        return favoriteService.getFavoriteTeams(auth.getName());
    }

    @GetMapping("/leagues")
    public Set<League> getFavoriteLeagues(Authentication auth) {
        return favoriteService.getFavoriteLeagues(auth.getName());
    }

    @PostMapping("/teams/{teamId}")
    public void toggleTeamFavorite(@PathVariable Long teamId, Authentication auth) {
        favoriteService.toggleTeam(auth.getName(), teamId);
    }

    @PostMapping("/leagues/{leagueId}")
    public void toggleLeagueFavorite(@PathVariable Long leagueId, Authentication auth) {
        favoriteService.toggleLeague(auth.getName(), leagueId);
    }
}