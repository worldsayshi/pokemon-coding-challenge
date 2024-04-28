#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"

IMAGE_NAME=$1

source $DIR/list-build-tags.sh $IMAGE_NAME | tail -1