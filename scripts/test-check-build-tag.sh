#!/bin/bash

IMAGE_NAME=$1

scriptDir=$(dirname -- "$(readlink -f -- "$BASH_SOURCE")")

last_built_tag=$($scriptDir/last-build-tag.sh $IMAGE_NAME)

if [ ! -z "${last_built_tag}" ]; then
    echo "IS NOT EMPTY"
fi

echo last_built_tag: $last_built_tag

tag=$(git describe --exact-match --tags $(git log -n1 --pretty='%h') 2> /dev/null)

echo tag: $tag
