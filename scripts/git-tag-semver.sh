#!/bin/bash

# NEED TO RUN IN gittools/gitversion:latest

function gitversion () {
  /tools/dotnet-gitversion "$@"
}
git config --add safe.directory /repo
git config user.email "cron@job"
git config user.name "Per"

# Check if the current git HEAD has a tag
tag=$(git describe --exact-match --tags $(git log -n1 --pretty='%h') 2> /dev/null)

# If no tag, create a new one
if [ -z "$tag" ]; then
    # Get full semantic version from gitversion
    version=$(gitversion /showvariable MajorMinorPatch)

    # Tag current HEAD with the version
    git tag -a "$version" -m "Tagging version $version"
    # echo "Tagged HEAD with $version"
    #echo "Name of user in gitversion docker image: $(whoami)"
    #git push origin "$version"
else
    echo "HEAD is already tagged with $tag"
    #git push origin "$tag"
fi
