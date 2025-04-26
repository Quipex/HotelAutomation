package com.hotel.backendservice.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Service for managing audit logs
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final AuditActorRepository auditActorRepository;

    /**
     * Get or create an audit actor
     *
     * @param platform The platform (e.g., "telegram", "web")
     * @param userId The user ID
     * @param userName The user name
     * @param userNick The user nickname
     * @param userAgent The user agent
     * @param ipAddress The IP address
     * @return The audit actor entity
     */
    @Transactional
    public AuditActorEntity getOrCreateActor(
            String platform,
            String userId,
            String userName,
            String userNick,
            String userAgent,
            String ipAddress
    ) {
        AuditActorEntity actor = new AuditActorEntity();
        actor.setPlatform(platform);
        actor.setUserId(userId);
        actor.setUserName(userName);
        actor.setUserNick(userNick);
        actor.setUserAgent(userAgent);
        actor.setIpAddress(ipAddress);
        actor.setCreatedAt(Instant.now());
        
        return auditActorRepository.save(actor);
    }

    /**
     * Create an audit log entry
     *
     * @param actor The actor who performed the action
     * @param action The action performed
     * @param objectType The type of object acted upon
     * @param objectId The ID of the object acted upon
     * @param details Additional details about the action
     * @return The created audit log entity
     */
    @Transactional
    public AuditLogEntity createAuditLog(
            AuditActorEntity actor,
            String action,
            String objectType,
            String objectId,
            String details
    ) {
        AuditLogEntity auditLog = new AuditLogEntity();
        auditLog.setActor(actor);
        auditLog.setAction(action);
        auditLog.setObjectType(objectType);
        auditLog.setObjectId(objectId);
        auditLog.setDetails(details);
        auditLog.setTimestamp(Instant.now());
        
        log.debug("Creating audit log: action={}, objectType={}, objectId={}", action, objectType, objectId);
        return auditLogRepository.save(auditLog);
    }

    /**
     * Find audit logs for a specific object
     *
     * @param objectType The type of object
     * @param objectId The ID of the object
     * @return List of audit logs for the object, ordered by timestamp (newest first)
     */
    @Transactional(readOnly = true)
    public List<AuditLogEntity> findAuditLogsForObject(String objectType, String objectId) {
        return auditLogRepository.findByObjectTypeAndObjectIdOrderByTimestampDesc(objectType, objectId);
    }
} 