#!/bin/bash

cd /synsemclass/july23_ver_latest_release/client/public/lindat-common

REPO="https://github.com/ufal/lindat-common"
TAG=`git ls-remote --tags $REPO | grep -v '\^{}' | sed -e 's/.*refs\/tags\/\(.*\)/\1/p' | sort -Vk2 | tail -n1`
curl -L "$REPO/releases/download/$TAG/dist.tar.gz" | tar -xz
