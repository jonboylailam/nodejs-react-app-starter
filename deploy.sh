#!/usr/bin/env bash
# Bundle the app and then scp it to tom.
# You must login and bounce the app for the changes to take affect.

gulp bundle; scp -r bundle.tar.gz jon@tom:~/apps/ice/.;
