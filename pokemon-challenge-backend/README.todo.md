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
    - [X] Get by id
    - [X] filter on type
    - [X] sorting by number properties
    - [X] fuzzy search by name
    - [X] (minimum length 3 characters) <-- HERE!!
    - [X] Insert Pokemon with referenced Pokemon
        - https://github.com/typeorm/typeorm/issues/1224
        - [X] Probably need bulk insert for this!?
    - [X] Get pokemon with referenced pokemon
    - [ ] Test that it's possible to insert consecutive pokemon where the latter is referencing the first
    - [ ] Test that it's not possible to insert consecutive pokemon if the first is referencing the latter that is not yet added
    - [X] suggest strong a good counter pokemon
        - returned pokemon should be strong against provided and not weak against provided
- [X] Fix type and weaknesses type safety in data-utils.ts
- [X] Add script for actually inserting the data outside of tests
- [ ] Split test db and regular db
- [-] Add pgadmin?
- TDD:
    - globalSetup and globalTeardown
        kubectl apply -k test-cluster
        kubectl delete -k test-cluster
    - Can't connect to db over tcp without hacking nginx or using port forward
    - Run tests as workflow in kubernetes?
    - Skip automated set up and tear down for now!
    - Assume existing and migrated DB
    - Then run tests against that!