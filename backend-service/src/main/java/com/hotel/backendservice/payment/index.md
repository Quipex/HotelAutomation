# Payment Package

This package contains components for managing payment transactions related to hotel bookings.

## Files

- **PaymentEntity.java** - JPA entity representing a payment transaction, including relationship to the associated
  booking, payment amount, payment time, and payment method details such as account type and number.

- **PaymentRepository.java** - JPA repository for PaymentEntity, providing methods to persist and retrieve payment
  records, including a method to find all payments associated with a specific booking. 
