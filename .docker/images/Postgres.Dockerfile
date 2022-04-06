FROM postgres:14.2-alpine

# Copy for loading postgres extensions
# Should include
COPY ./load-postgres-extensions.sh /docker-entrypoint-initdb.d/
RUN chmod 755 /docker-entrypoint-initdb.d/load-postgres-extensions.sh
