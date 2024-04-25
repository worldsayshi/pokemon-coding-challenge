
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

# TODO

- [ ] Create database in kubernetes or outside
- [ ] Create initial migration for entities
- [ ] Implement endpoints
- [ ] Add pgadmin?