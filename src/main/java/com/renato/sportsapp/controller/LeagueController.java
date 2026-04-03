package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.League;
import com.renato.sportsapp.service.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leagues")
@RequiredArgsConstructor
public class LeagueController {

    private final LeagueService leagueService;

    @GetMapping
    public ResponseEntity<List<League>> getAll() {
        return ResponseEntity.ok(leagueService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<League> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leagueService.getById(id));
    }

    @GetMapping("/sport/{sportId}")
    public ResponseEntity<List<League>> getBySport(@PathVariable Long sportId) {
        return ResponseEntity.ok(leagueService.getBySport(sportId));
    }

    @PostMapping
    public ResponseEntity<League> create(@RequestBody League league) {
        return ResponseEntity.ok(leagueService.create(league));
    }

    @PutMapping("/{id}")
    public ResponseEntity<League> update(@PathVariable Long id, @RequestBody League league) {
        return ResponseEntity.ok(leagueService.update(id, league));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leagueService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
