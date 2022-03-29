#!/bin/sh

ORGA=opty-fi

ADAPTER=Curve CONFIG=avalanche SLUG=$ORGA/curve-avalanche yarn setup
ADAPTER=Curve CONFIG=ethereum  SLUG=$ORGA/curve-ethereum  yarn setup
ADAPTER=Curve CONFIG=fantom    SLUG=$ORGA/curve-fantom    yarn setup
ADAPTER=Curve CONFIG=polygon   SLUG=$ORGA/curve-polygon   yarn setup
