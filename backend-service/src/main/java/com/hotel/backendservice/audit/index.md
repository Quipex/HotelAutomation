# Audit Package

This package provides a comprehensive auditing solution for tracking user actions across the hotel automation system.

## Files

- **AuditableAction.java** - Annotation to mark methods that should be audited. It includes attributes for specifying
  the action type, object type, and expressions to extract object IDs and details.

- **AuditAspect.java** - Aspect that intercepts methods annotated with @AuditableAction and logs the action to the audit
  log. It extracts relevant information from method parameters and results using reflection and SpEL expressions.

- **AuditContextHolder.java** - ThreadLocal storage for audit context, which contains information about the current
  user, platform, IP address, and other metadata needed for auditing.

- **AuditService.java** - Service for managing audit logs, including creating audit actors and log entries, and
  retrieving audit logs for specific objects.

- **AuditLogEntity.java** & **AuditActorEntity.java** - JPA entities representing audit log entries and actors who
  perform actions.

- **AuditLogRepository.java** & **AuditActorRepository.java** - Spring Data JPA repositories for database operations on
  audit entities.

## Usage

### Setting up Audit Context

Before calling methods that should be audited, set up the audit context:

```java
AuditContextHolder.AuditContext context = new AuditContextHolder.AuditContext(
    "web",           // platform
    "user123",       // userId
    "John Doe",      // userName
    "johndoe",       // userNick
    "Mozilla/5.0...", // userAgent
    "192.168.1.1"    // ipAddress
);
AuditContextHolder.setContext(context);

// Don't forget to clear context when done
try {
    // Call methods that will be audited
} finally {
    AuditContextHolder.clearContext();
}
```

### Marking Methods for Auditing

Annotate methods that should be logged to the audit trail:

```java
@AuditableAction(
    action = "create",
    objectType = "booking",
    objectIdExpression = "#result.id",
    detailsExpression = "{ 'roomId': #booking.roomId, 'startDate': #booking.startDate }"
)
public Booking createBooking(BookingRequest booking) {
    // Method implementation
}
```

### Retrieving Audit Logs

```java
// Get all audit logs for a specific booking
List<AuditLogEntity> logs = auditService.findAuditLogsForObject("booking", bookingId);
```
