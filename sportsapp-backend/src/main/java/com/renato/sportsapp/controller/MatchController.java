package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.Match;
import com.renato.sportsapp.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<Match>> getAll() {
        return ResponseEntity.ok(matchService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getById(id));
    }

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<List<Match>> getByLeague(@PathVariable Long leagueId) {
        return ResponseEntity.ok(matchService.getByLeague(leagueId));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Match>> getByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(matchService.getByTeam(teamId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Match>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(matchService.getByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Match> create(@RequestBody Match match) {
        return ResponseEntity.ok(matchService.create(match));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> update(@PathVariable Long id, @RequestBody Match match) {
        return ResponseEntity.ok(matchService.update(id, match));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matchService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
