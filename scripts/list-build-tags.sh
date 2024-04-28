#!/bin/bash

#TAGS=$(curl -s -S 'https://registry.hub.docker.com/v2/repositories/pfredelius/hello-world/tags/' | jq '."results"[]["name"]' | tr -d '"' | sort -t "." -k1,1n -k2,2n -k3,3n)
#LAST_TAG=$$(echo $$TAGS | tail -1)
#echo "$TAGS"
#echo "hello: $TAGS"

IMAGE_NAME=$1
#echo "IMAGE_NAME: $IMAGE_NAME"
#echo "https://registry.hub.docker.com/v2/repositories/pfredelius/$IMAGE_NAME/tags/"

# Tags seem to be returned from docker hub with the last tag first. Here we reverse it so latest tag comes last:
curl -f -s -S "https://registry.hub.docker.com/v2/repositories/pfredelius/$IMAGE_NAME/tags/" | jq '."results"[]["name"]' | tr -d '"' | sort -r

# Unsuccessful attempt at sorting on the semantic version:
# sort -t "." -k1,1n -k2,2n -k3,3n