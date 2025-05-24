package com.hotel.backendservice.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {
    @Query(value = "SELECT * FROM notification WHERE status = CAST(:status AS notification_status)", nativeQuery = true)
    List<NotificationEntity> findByStatusRaw(@Param("status") String status);

    List<NotificationEntity> findByStatusOrderByCreatedAtDesc(NotificationStatus status);
}
