package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PlayerRepository extends JpaRepository<Player, Long> {}
