package com.example.chatapp;

import com.google.gson.annotations.SerializedName;

public class LoginResult {
    private String username;

    @SerializedName("email")
    private String email;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
