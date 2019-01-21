#!/bin/bash

export PIXEL_REV=$1
docker stack deploy -c docker-stack.yml --with-registry-auth pixel