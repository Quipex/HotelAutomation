package com.hotel.backendservice.sync;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SyncStatusRepository extends JpaRepository<SyncStatusEntity, Long> {
  @Query("SELECT s FROM SyncStatusEntity s ORDER BY s.lastSyncAt DESC")
  Optional<SyncStatusEntity> findLatestSyncStatus();
}
