package com.renato.sportsapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "leagues")
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String logoUrl;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private Sport sport;
}
