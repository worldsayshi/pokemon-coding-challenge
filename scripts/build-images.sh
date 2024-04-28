#!/bin/bash

DOCKER_HUB_USER_NAME=pfredelius

DIR="$(cd "$(dirname "$0")" && pwd)"
scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")

# workaround for https://github.com/nvm-sh/nvm/issues/1290
. ~/.nvm/nvm.sh

# Check if the current git HEAD has a tag
# BUG $changes will always compare current branch with itself!
# - Because each commmit will be tagged!
# - 
tag=$(git describe --exact-match --tags $(git log -n1 --pretty='%h') 2> /dev/null)
if [ -z "$tag" ]; then
    echo "HEAD is not tagged. Please tag before building images."; \
    exit 1
fi
for dir in $(find . -name Dockerfile -printf '%h\n'); do
    ABS_DIR=$(readlink -f $dir)
    IMAGE_NAME=$(basename $dir)
    FULL_IMAGE_NAME=$DOCKER_HUB_USER_NAME/$IMAGE_NAME:$tag


    if docker manifest inspect $FULL_IMAGE_NAME >/dev/null 2>&1; then
      echo "Already exists: $FULL_IMAGE_NAME"
      continue
    fi

    # If there are pre-existing builds, check if there are any changes since
    last_built_tag=$($scriptDir/last-build-tag.sh $IMAGE_NAME)
    if [ ! -z "${last_built_tag}" ]; then
      # Compare HEAD with last build tag
      changes=$(git diff --name-status $last_built_tag..HEAD $dir | wc -l)

      if [ $changes -eq 0 ]; then
        echo "No changes since $last_built_tag to warrant building $FULL_IMAGE_NAME at $ABS_DIR"
        continue
      fi
    fi

    if [ -f $ABS_DIR/pre-docker.sh ]; then
      echo "Found $ABS_DIR/pre-docker.sh, will run it"
      (cd $ABS_DIR && ./pre-docker.sh)
      
      if [ $? -ne 0 ]; then
        echo "pre-docker.sh script run failed in $ABS_DIR, aborting docker build"
        continue
      fi
    
    else
      echo "Found no $ABS_DIR/pre-docker.sh, skipping pre-docker bash script for $FULL_IMAGE_NAME"
    fi

    if [ -f $ABS_DIR/package.json ]; then
      echo "Found $ABS_DIR/package.json, will run 'npm run pre-docker --if-present'"
      (cd $ABS_DIR && (nvm use && npm run pre-docker --if-present))
      
      if [ $? -ne 0 ]; then
        echo "npm build failed, aborting docker build"
        continue
      fi
    
    else
      echo "Found no $ABS_DIR/package.json, skipping node build for $FULL_IMAGE_NAME"
    fi
    
    echo "Building: $FULL_IMAGE_NAME at $ABS_DIR"
    docker run --rm -v $ABS_DIR:/workspace -v $HOME/.docker/config.json:/kaniko/.docker/config.json:ro gcr.io/kaniko-project/executor:latest --dockerfile=Dockerfile --destination="$FULL_IMAGE_NAME"
done