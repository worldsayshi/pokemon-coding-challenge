#!/bin/bash

# This script will check if the current git commit is the same as the origin commit
# and if not it will execute the arguments to it as its own command.

git fetch origin

# Get commit id of tips of origin and local
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL != $REMOTE ]; then
    # Make sure that local is up to date for next run
    git pull
    # Run the script
    "$1" "${@:2}"
else
    echo "Your local repository is up-to-date."
fi
