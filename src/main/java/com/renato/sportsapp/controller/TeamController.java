package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.Team;
import com.renato.sportsapp.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<List<Team>> getAll() {
        return ResponseEntity.ok(teamService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getById(id));
    }

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<List<Team>> getByLeague(@PathVariable Long leagueId) {
        return ResponseEntity.ok(teamService.getByLeague(leagueId));
    }

    @GetMapping("/sport/{sportId}")
    public ResponseEntity<List<Team>> getBySport(@PathVariable Long sportId) {
        return ResponseEntity.ok(teamService.getBySport(sportId));
    }

    @PostMapping
    public ResponseEntity<Team> create(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.create(team));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> update(@PathVariable Long id, @RequestBody Team team) {
        return ResponseEntity.ok(teamService.update(id, team));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
