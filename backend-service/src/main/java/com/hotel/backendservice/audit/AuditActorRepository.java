package com.hotel.backendservice.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditActorRepository extends JpaRepository<AuditActorEntity, Long> {
    // Custom methods can be added here as needed
}
