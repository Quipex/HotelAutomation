package com.hotel.backendservice.client;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {

    /**
     * Find clients by fuzzy name matching using PostgreSQL's similarity operator (%)
     *
     * @param name The name pattern to search for
     * @return List of matching clients
     */
    @Query(value = "SELECT * FROM client WHERE full_name % :name ORDER BY full_name <-> :name", nativeQuery = true)
    List<ClientEntity> findByNameFuzzy(@Param("name") String name);
}
