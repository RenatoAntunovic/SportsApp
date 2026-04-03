package com.renato.sportsapp.controller;

import com.renato.sportsapp.entity.Sport;
import com.renato.sportsapp.service.SportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
public class SportController {
    private final SportService sportService;

    @GetMapping
    public ResponseEntity<List<Sport>> getAll(){
        return ResponseEntity.ok(sportService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sport> getById(@PathVariable Long id){
        return ResponseEntity.ok(sportService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Sport> create(@RequestBody Sport sport) {
        return ResponseEntity.ok(sportService.create(sport));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sport> update(@PathVariable Long id, @RequestBody Sport sport) {
        return ResponseEntity.ok(sportService.update(id, sport));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
