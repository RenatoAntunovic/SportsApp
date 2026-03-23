package com.renato.sportsapp.repository;
import com.renato.sportsapp.entity.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SportRepository extends JpaRepository<Sport, Long> {}
