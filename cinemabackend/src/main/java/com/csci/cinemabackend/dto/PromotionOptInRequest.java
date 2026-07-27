package com.csci.cinemabackend.dto;

public class PromotionOptInRequest {

    private boolean optIn;

    public PromotionOptInRequest() {
    }

    public PromotionOptInRequest(boolean optIn) {
        this.optIn = optIn;
    }

    public boolean isOptIn() {
        return optIn;
    }

    public void setOptIn(boolean optIn) {
        this.optIn = optIn;
    }
}