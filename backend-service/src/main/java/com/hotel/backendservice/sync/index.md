# Sync Package

This package contains components for synchronizing data with external Property Management Systems (PMS).

## Files

- **PmsClient.java** - Interface defining the contract for communication with external Property Management Systems,
  including methods for authentication and fetching booking data.

- **EasyMsClientRest.java** - Implementation of the PmsClient interface for connecting to the EasyMS PMS system via REST
  API, handling authentication, retries, and data mapping.

- **SyncStatusEntity.java** - JPA entity representing the status of data synchronization operations, including
  timestamps, duration, status, and details of the sync process.

- **SyncStatusRepository.java** - JPA repository for SyncStatusEntity, providing methods to persist and retrieve
  synchronization status records.

## Subdirectories

- **dto/** - Contains Data Transfer Objects used specifically for communication with external PMS systems. 
