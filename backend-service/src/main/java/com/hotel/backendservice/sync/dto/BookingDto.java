package com.hotel.backendservice.sync.dto;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class BookingDto {
    private String id;
    private Integer organizationId;
    private CustomerDto customer;
    private List<RoomReservationDto> rooms;
    private String status;
    private List<Object> services;
    private Long bookedAt;
    private Long modifiedAt;
    private String source;
    private Integer responsibleUserId;
    
    @Data
    public static class CustomerDto {
        private String name;
        private String email;
        private String telephone;
        private String remarks;
        private String address;
        private String city;
        private String countryCode;
        private String zip;
        private String ccName;
        private String ccNumber;
        private String ccExpirationDate;
    }
    
    @Data
    public static class RoomReservationDto {
        private String roomReservationId;
        private String roomId;
        private Integer categoryId;
        private Long arrival;
        private Long departure;
        private String guestName;
        private List<Object> addOns;
        private Integer numberOfGuests;
        private List<GuestExtraChargeDto> guestExtraCharges;
        private String remarks;
        private Integer rateId;
        private String status;
        private String currencyCode;
        private Double invoice;
        private Double paid;
        private Boolean locked;
        private Boolean detailed;
    }
    
    @Data
    public static class GuestExtraChargeDto {
        private Double amount;
        private String currency;
        private Boolean included;
        private Boolean perNight;
        private Boolean perPerson;
        private String percentage;
        private String text;
    }
}
