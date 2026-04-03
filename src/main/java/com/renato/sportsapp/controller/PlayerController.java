package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.Player;
import com.renato.sportsapp.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<Player>> getAll() {
        return ResponseEntity.ok(playerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getById(@PathVariable Long id) {
        return ResponseEntity.ok(playerService.getById(id));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Player>> getByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getByTeam(teamId));
    }

    @PostMapping
    public ResponseEntity<Player> create(@RequestBody Player player) {
        return ResponseEntity.ok(playerService.create(player));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> update(@PathVariable Long id, @RequestBody Player player) {
        return ResponseEntity.ok(playerService.update(id, player));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        playerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
