package com.csci.cinemabackend.dto;

public class ChangeEmailRequest {
    private String newEmail;
    private String currentPassword;

    public ChangeEmailRequest(String newEmail, String currentPassword) {
        this.newEmail = newEmail;
        this.currentPassword = currentPassword;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setNewEmail(String email) {
        this.newEmail = email;
    }

    public void setCurrentPassword(String password) {
        this.currentPassword = password;
    }
}
