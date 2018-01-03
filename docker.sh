#!/bin/bash

docker run -d --volume gucmitglieder-dev:/var/lib/postgresql/data -p 5432:5432 --name postgres_guc-dev postgres:10.0-alpine 

docker run -d --name postgrest-dev --link postgres_guc-dev:db -p 3000:3000 --env PGRST_DB_URI=postgres://postgres@db:5432/ --env PGRST_DB_SCHEMA=public --env PGRST_DB_ANON_ROLE=postgres --env PGRST_SERVER_PROXY_URI=https://example.com/basePath postgrest/postgrest


