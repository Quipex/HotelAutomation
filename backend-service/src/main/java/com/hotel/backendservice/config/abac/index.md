# ABAC Configuration Package

This package provides Attribute-Based Access Control (ABAC) functionality, which allows for fine-grained access control based on attributes of the user, resources, and environment.

## Files

- **AbacAspect.java** - Aspect that enforces ABAC policies on methods annotated with @CheckPermission. It intercepts calls to these methods, evaluates the appropriate policy expression using user attributes from the audit context, and either allows the operation or throws an AccessDeniedException.

- **CheckPermission.java** - Annotation to mark methods that require permission checks using ABAC policies. Takes a policy name as a parameter, which maps to a policy defined in the abac-policies.yml configuration file.

- **PolicyConfig.java** - Configuration class that represents the structure of the ABAC policies YAML file, containing a map of policy names to Spring Expression Language (SpEL) expressions.

- **PolicyController.java** - REST controller that provides endpoints for policy management, including an endpoint to reload policies from the configuration file at runtime (which itself is secured using ABAC).

- **PolicyService.java** - Service for loading, validating, and providing access to ABAC policies from the YAML configuration file. Handles policy parsing, compilation, and caching for efficient evaluation.

## Usage

Policies are defined in the `abac-policies.yml` file using Spring Expression Language (SpEL) and can reference:

- User attributes (platform, userId, userName, userNick)
- User role (admin, manager, user)
- Method parameters through SpEL variables

Example policies:
- `admin: "role == 'admin'"` - Requires admin role
- `modify_booking: "role == 'admin' or role == 'manager' or userId == #bookingUserId"` - Allows admins, managers, or the booking owner to modify a booking

To protect a method with ABAC:
```java
@CheckPermission("admin")
public void adminOnlyMethod() {
    // Only admins can access this method
}

@CheckPermission("modify_booking") 
public void updateBooking(@PathVariable UUID id, @RequestParam String bookingUserId) {
    // Method parameters are available in policy expressions
}
```

When a protected method is called, the AbacAspect intercepts the call, evaluates the associated policy, and either allows the operation to proceed or denies access with an AccessDeniedException. 