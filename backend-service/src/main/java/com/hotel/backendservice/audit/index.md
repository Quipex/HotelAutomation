# Audit Package

This package provides auditing capabilities for tracking system activities and user interactions.

## Files

- **AuditLogEntity.java** - Entity representing an audit log entry that tracks actions performed in the system, including who performed the action, what was done, and when it occurred. Contains metadata such as timestamp, actor, action type, and JSON details.

- **AuditActorEntity.java** - Entity representing the actor (user or system) who performed an action being audited. Stores attributes like user ID, username, platform, IP address, and user agent information.

- **AuditLogRepository.java** - JPA repository for persisting and retrieving AuditLogEntity records, including query methods for retrieving audit logs by object type and ID.

- **AuditActorRepository.java** - JPA repository for persisting and retrieving AuditActorEntity records, providing basic CRUD operations for audit actors. 