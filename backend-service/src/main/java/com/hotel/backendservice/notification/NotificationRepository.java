package com.hotel.backendservice.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {
    List<NotificationEntity> findByStatus(String status);
    
    List<NotificationEntity> findByStatusOrderByCreatedAtDesc(String status);
} 