

# Getting the backend up and running

## Database setup
```bash
export POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run typeorm \
    -- migration:run \
    -d db/dataSource.local-cluster.ts
```
Port forward:
```bash
kubectl -n pokemon port-forward svc/pokemon-challenge-pg-rw 5432:5432
```

## Run backend locally

Make sure that variables in `.env` are set correctly, then run:
```bash
export POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run start:dev
```

## Insert data

```bash
npm run insert-data
```

# Run tests for backend

Port forward the test db:
```bash
kubectl -n pokemon port-forward svc/pokemon-challenge-pg-test-rw 5433:5432
```

Migrate the test db, set the password and run the tests:
```bash
export POKEMON_SQL_PASSWORD_TEST=$(kubectl get -n pokemon secret pokemon-challenge-pg-test-app -o json | jq -r '.data.password | @base64d')
npm run typeorm \
    -- migration:run \
    -d db/dataSource.local-cluster-test.ts
npm run test:e2e
```

# Other Dev actions

First, make sure that `POKEMON_SQL_PASSWORD` is set:
```bash
export POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
```

## Generate migration

```bash
MIGRATION_NAME=MyFix
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

# Known issues

- Tried using sqlite for "mocking" postgres but got blocked because typeorm + sqlite seem to have a bug regarding enum arrays
    - Maybe this one: https://github.com/typeorm/typeorm/issues/6326
    - Let's use postgres directly (running the tests require postgres)


# "Future developments"

- Opinion: Use Hasura and Graphql, at least for the backend <-> postgres logic.
    Hasura has better ergonomics for handling relational data.
- Run automated builds, deployment, tests and promotion in k8s using ArgoCd and Argo Workflows
