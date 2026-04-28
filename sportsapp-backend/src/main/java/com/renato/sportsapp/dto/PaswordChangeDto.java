package com.renato.sportsapp.dto;

import lombok.Data;

@Data
public class PaswordChangeDto {
    private String currentPassword;
    private String newPassword;
}
