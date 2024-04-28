# Pokemon coding test

This is an implementation of the [Pokemon coding test](./pokemon-coding-test.pdf)

Documentation for the backend assumes that postgres is running in kubernetes.
For instructions on how to set this up see [README.k8s.md](./cluster-config/README.k8s.md).
However, the instructions should work with minimal adjustments for a local postgres server.

For further instructions on running the backend and setting up the schema and such, see [pokemon-challenge-backend/README.md](./pokemon-challenge-backend/README.md).


## What's included

- Backend in Nest.js using TypeORM to connect to the DB
- Jest tests that test the requirements
- OpenAPI/Swagger spec and gui
- Deployment configuration for deploying to Kubernetes
- Build scripts for building the app and pushing it to docker hub