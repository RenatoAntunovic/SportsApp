package com.renato.sportsapp.service;


import com.renato.sportsapp.entity.Sport;
import com.renato.sportsapp.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SportService {
    private final SportRepository sportRepository;

    public List<Sport> getAll(){
        return sportRepository.findAll();
    }

    public Sport getById(Long id){
        return sportRepository.findById(id).orElseThrow(() -> new RuntimeException("Sport koji ima ID: "+id+" nije pronađen"));
    }

    public Sport create(Sport sport){
        return  sportRepository.save(sport);
    }

    public Sport update(Long id , Sport updatedSport){
        Sport existing = getById(id);
        existing.setName(updatedSport.getName());
        existing.setIconUrl(updatedSport.getIconUrl());
        return  sportRepository.save(existing);
    }

    public void delete(Long id) {
        try {
            sportRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Ne možeš obrisati sport koji ima vezane lige. Prvo obriši sve lige tog sporta!");
        }
    }
}
