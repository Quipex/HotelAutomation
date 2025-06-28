package com.hotel.backendservice.config;

import com.hotel.backendservice.client.ClientRepository;
import com.hotel.backendservice.booking.BookingRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class TestDataLoader {

    private final ClientRepository  clientRepo;
    private final BookingRepository bookingRepo;

    public TestDataLoader(ClientRepository clientRepo,
                          BookingRepository bookingRepo) {
        this.clientRepo  = clientRepo;
        this.bookingRepo = bookingRepo;
    }

    /** Basic data for all tests */
    @Transactional
    public void setupDefault() {
        // Here we can add default data if needed
    }

    /** Full cleanup of all tables */
    @Transactional
    public void clearDatabase() {
        bookingRepo.deleteAll();
        clientRepo.deleteAll();
    }
} 