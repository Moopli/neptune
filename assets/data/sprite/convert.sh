#!/bin/sh

for i in `find $myfolder -depth -name '*.xcf'`; do xcf2png $i -o `echo $i | sed -e 's/xcf$/png/'`; done
