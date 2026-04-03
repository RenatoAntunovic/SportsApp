package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.Player;
import com.renato.sportsapp.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<Player> getAll() {
        return playerRepository.findAll();
    }

    public Player getById(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
    }

    public List<Player> getByTeam(Long teamId) {
        return playerRepository.findByTeamId(teamId);
    }

    public Player create(Player player) {
        return playerRepository.save(player);
    }

    public Player update(Long id, Player updatedPlayer) {
        Player existing = getById(id);
        existing.setName(updatedPlayer.getName());
        existing.setPosition(updatedPlayer.getPosition());
        existing.setAge(updatedPlayer.getAge());
        existing.setNationality(updatedPlayer.getNationality());
        existing.setPhotoUrl(updatedPlayer.getPhotoUrl());
        existing.setTeam(updatedPlayer.getTeam());
        return playerRepository.save(existing);
    }

    public void delete(Long id) {
        playerRepository.deleteById(id);
    }
}
