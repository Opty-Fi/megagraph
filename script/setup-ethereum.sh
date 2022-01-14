#!/bin/sh

ORGA=opty-fi

for i in $(find src -path 'src/*/config/ethereum.json'|cut -d "/" -f 2|sort); do
  # all lowercase
  lc="$(echo $i | tr '[A-Z]' '[a-z]')"
  ADAPTER=$i CONFIG=ethereum SLUG=$ORGA/${lc}-ethereum yarn setup
done
