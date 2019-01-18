#!/usr/bin/env bash
set -euo pipefail
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

BUILD_COUNT=$1
APP="asapixel"
echo "Building..."
PUSH=${PUSH:-false}
BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
SHA="$(git rev-parse --short --verify HEAD)"

if [ "$BRANCH" == "master" ]; then
    BRANCH=""
fi
set +u
REV="${REV:-${BUILD_COUNT}_${BRANCH}_${SHA}}"
set -u
echo "Docker tag is ${REV}"

docker build -f $DIR/Dockerfile -t registry.activitystream.com:5043/${APP}:$REV .
docker tag registry.activitystream.com:5043/${APP}:$REV registry.activitystream.com:5043/${APP}:latest
$PUSH && docker push registry.activitystream.com:5043/${APP}:$REV
$PUSH && docker push registry.activitystream.com:5043/${APP}:latest
echo Done