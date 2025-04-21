package com.hotel.backendservice.client;

import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ClientJooqRepository {

    private final DSLContext dslContext;
    private final ClientMapper clientMapper;

    /**
     * Find clients by fuzzy name matching using PostgreSQL's similarity operator (%)
     *
     * @param name The name pattern to search for
     * @return List of matching clients
     */
    public List<ClientDto> findByNameFuzzy(String name) {
        Result<Record> records = dslContext
                .select()
                .from("client")
                .where("full_name % {0}")
                .orderBy(dslContext.field("full_name <-> {0}").asc())
                .bind(0, name)
                .fetch();

        return records.stream()
                .map(record -> {
                    com.hotel.backendservice.client.ClientEntity entity = new com.hotel.backendservice.client.ClientEntity();
                    entity.setId(record.get("id", java.util.UUID.class));
                    entity.setFirstName(record.get("first_name", String.class));
                    entity.setLastName(record.get("last_name", String.class));
                    entity.setMiddleName(record.get("middle_name", String.class));
                    entity.setFullName(record.get("full_name", String.class));
                    entity.setPhones((String[]) record.get("phones"));
                    entity.setEmail(record.get("email", String.class));
                    entity.setNotes(record.get("notes", String.class));
                    entity.setCreatedAt(record.get("created_at", java.time.Instant.class));
                    entity.setUpdatedAt(record.get("updated_at", java.time.Instant.class));
                    return clientMapper.toDto(entity);
                })
                .collect(Collectors.toList());
    }
}
