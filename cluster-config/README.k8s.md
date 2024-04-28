
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

# Port forward

```
kubectl -n pokemon port-forward svc/pokemon-challenge-pg-rw 5432:5432
```