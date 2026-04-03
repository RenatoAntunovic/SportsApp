package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.Standing;
import com.renato.sportsapp.service.StandingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
@RequiredArgsConstructor
public class StandingController {

    private final StandingService standingService;

    @GetMapping
    public ResponseEntity<List<Standing>> getAll() {
        return ResponseEntity.ok(standingService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Standing> getById(@PathVariable Long id) {
        return ResponseEntity.ok(standingService.getById(id));
    }

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<List<Standing>> getByLeague(@PathVariable Long leagueId) {
        return ResponseEntity.ok(standingService.getByLeague(leagueId));
    }

    @PostMapping
    public ResponseEntity<Standing> create(@RequestBody Standing standing) {
        return ResponseEntity.ok(standingService.create(standing));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Standing> update(@PathVariable Long id, @RequestBody Standing standing) {
        return ResponseEntity.ok(standingService.update(id, standing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        standingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
