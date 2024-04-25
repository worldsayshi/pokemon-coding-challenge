
# Prerequisites

## Local Kubernetes instance
Install Docker desktop:
https://www.docker.com/get-started/

Enable kubernetes in Docker Desktop:
https://docs.docker.com/desktop/kubernetes/


# Deployment

```
kubectl apply -k cluster-config
```

Add the following to /etc/hosts or c:\windows\system32\drivers\etc\hosts
```
127.0.0.1 pokemon-challenge.local-cluster
::1 pokemon-challenge.local-cluster localhost
```


# Database setup

```bash
PGPASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run typeorm \
    -- migration:run \
    -d db/dataSource.local-cluster.ts
```
Port forward:
```bash
kubectl -n pokemon port-forward svc/pokemon-challenge-pg-rw 5432:5432
```

# Run locally

```bash
POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run start:dev
```

# Dev

## Get password

```bash
PGPASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
```

## Generate migration

```bash
MIGRATION_NAME=InitialPokemon
npm run typeorm \
    -- migration:generate db/migrations/$MIGRATION_NAME \
    -d db/dataSource.local-cluster.ts
```

## Revert migration

```bash

npm run typeorm \
    -- migration:revert \
    -d db/dataSource.local-cluster.ts
```

## Show applied migrations
```bash
npm run typeorm \
    -- migration:show \
    -d db/dataSource.local-cluster.ts
```

# TODO

- [X] Create database in kubernetes or outside
- [ ] TDD: Implement endpoints and data ingestion
- [ ] Create initial migration for entities
- [ ] Add pgadmin?
- TDD:
    - globalSetup and globalTeardown
        kubectl apply -k test-cluster
        kubectl delete -k test-cluster
    - Can't connect to db over tcp without hacking nginx or using port forward
    - Run tests as workflow in kubernetes?
    - Skip automated set up and tear down for now!
    - Assume existing and migrated DB
    - Then run tests against that!

# Known issues

- Tried using sqlite for "mocking" postgres but got blocked because typeorm + sqlite seem to have a bug regarding enum arrays
    - Maybe this one: https://github.com/typeorm/typeorm/issues/6326
    - Let's use postgres for now