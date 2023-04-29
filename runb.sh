#!/bin/bash

set -e

cd "$(dirname "$0")/back-end"

go run ./cmd/api
