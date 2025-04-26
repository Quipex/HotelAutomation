package com.hotel.backendservice.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntity, Long> {
  List<AuditLogEntity> findByObjectTypeAndObjectIdOrderByTimestampDesc(String objectType, String objectId);
}
