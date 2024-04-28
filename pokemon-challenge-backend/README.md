# Pokemon coding test

This is an implementation of the [Pokemon coding test](../pokemon-coding-test.pdf)

Documentation below assumes that postgres is running in kubernetes.
For instructions on how to set this up see [README.k8s.md](../cluster-config/README.k8s.md).
However, the instructions should work with minimal adjustments for a local postgres server.

# Database setup
```bash
POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run typeorm \
    -- migration:run \
    -d db/dataSource.local-cluster.ts
```
Port forward:
```bash
kubectl -n pokemon port-forward svc/pokemon-challenge-pg-rw 5432:5432
```

# Run backend locally

Make sure that variables in `.env` are set correctly, then run:
```bash
POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run start:dev
```

# Run tests for backend

```bash
POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
npm run test:e2e
```

# Dev actions

First, make sure that `POKEMON_SQL_PASSWORD` is set:
```bash
POKEMON_SQL_PASSWORD=$(kubectl get -n pokemon secret pokemon-challenge-pg-app -o json | jq -r '.data.password | @base64d')
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


# Future developments

- Opinion: Use Hasura and Graphql, at least for the backend <-> postgres logic.
    Hasura has better ergonomics for handling relational data.
