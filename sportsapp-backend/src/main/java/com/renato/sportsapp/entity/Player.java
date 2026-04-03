package com.renato.sportsapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String position;
    private String nationality;
    private Integer age;
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
}
