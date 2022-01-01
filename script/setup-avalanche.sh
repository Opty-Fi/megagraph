#!/bin/sh

ORGA=opty-fi

for i in $(find src -path 'src/*/config/avalanche.json'|cut -d "/" -f 2|sort); do
  # all lowercase
  lc="$(echo $i | tr '[A-Z]' '[a-z]')"
  ADAPTER=$i CONFIG=avalanche SLUG=$ORGA/${lc}-avalanche yarn setup
done
