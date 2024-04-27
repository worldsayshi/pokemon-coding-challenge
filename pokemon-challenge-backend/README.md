
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
npm run start:dev
```

# Run tests

```bash
POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run test:e2e
```

# Dev

## Get password

```bash
PGPASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
```

## Generate migration

```bash
MIGRATION_NAME=FixMultipliersColumnType
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
- [X] Create a proper "test rig"
- [X] Create initial migration for entities
- [X] TDD: Implement endpoint for data ingestion
    - [X] Recheck the requirements to be sure I'm onm the right track! <-- HERE!
    - [X] Bug: multiplier field should be a float, not an integer! Need a migration.
    - [/] Bug: next_evolution and prev_evolution are shown as string[] in swagger. That's not good...
        - I need to split the swagger type from the database type!
        - [ ] Verify that it works when retrieving it
- [ ] TDD: Implement other endpoints.
    - [ ] Get by id
    - [ ] filter on type
    - [ ] sorting by number properties
    - [ ] Insert Pokemon with referenced Pokemon
    - [ ] Get pokemon with referenced pokemon
    - [ ] fuzzy search by name (minimum length 3 characters)
    - [ ] suggest strong a good counter pokemon
        - return a pokemon that is strong against a provided pokemon
        - returned pokemon should be strong against provided and not weak against provided
- [ ] Fix type and weaknesses type safety in data-utils.ts

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
- "Jest did not exit one second after the test run has completed.

    'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
    Waiting for the debugger to disconnect..."


# Technical design considerations
- Internal data structure is exposed in a "loosely coupled" way
    - The Pokemon type in pokemon.entity is used both as a means for setting up the schema as well as providing the type for the pokemon.controller.
    - This means that the database schema is coupled with the rest api.
    - However, if there is a future need for the api and the db schema to diverge this can easily be changed without notifying consumers internally by using different types in the controller and the repository. So the coupling is thus of a loose kind.