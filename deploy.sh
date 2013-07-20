!#/usr/bin/env bash

# Make sure nodejs is installed
# sudo apt-get update
# sudo apt-get install python-software-properties python g++ make
# sudo add-apt-repository ppa:chris-lea/node.js
# sudo apt-get update
# sudo apt-get install nodejs

# Add postgres 
# sudo apt-get install postgresql postgresql-client

# Make sure the db doesn't already exist
dropdb japb
createdb japb
psql -d japb -a -f ./db/deploy.sql

# Manage node packages
# cd app
# npm install
# npm update
# cd ..