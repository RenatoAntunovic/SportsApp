package com.renato.sportsapp.service;

import com.renato.sportsapp.entity.League;
import com.renato.sportsapp.repository.LeagueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class LeagueService {
    private final LeagueRepository leagueRepository;


    public List<League> findAll(){
        return  leagueRepository.findAll();
    }

    public League getById(Long id){
        return leagueRepository.findById(id).orElseThrow(()->new RuntimeException("Liga sa ID: "+id+" nije pronađena"));
    }

    public League create(League league){
        return  leagueRepository.save(league);
    }

    public List<League> getBySport(Long sport){
        return  leagueRepository.findBySportId(sport);
    }

    public League update(Long id, League updatedLeague){
        League existing = getById(id);
        existing.setName(updatedLeague.getName());
        existing.setCountry(updatedLeague.getCountry());
        existing.setLogoUrl(updatedLeague.getLogoUrl());
        existing.setSport(updatedLeague.getSport());
        return leagueRepository.save(existing);
    }

    public void delete(Long id){
        leagueRepository.deleteById(id);
    }
}
