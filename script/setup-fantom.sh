#!/bin/sh

ORGA=opty-fi

for i in $(find src -path 'src/*/config/fantom.json'|cut -d "/" -f 2|sort); do
  # all lowercase
  lc="$(echo $i | tr '[A-Z]' '[a-z]')"
  ADAPTER=$i CONFIG=fantom SLUG=$ORGA/${lc}-fantom yarn setup
done
