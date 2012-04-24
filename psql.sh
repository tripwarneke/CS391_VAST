#! /bin/bash

# run psql on edlab with given user as first arg and
# the SQL script to execute as the second argument.

if [ $# -lt 1 ]; then
    echo "usage: loaddb.sh USER [SQL SCRIPT]"
    exit 1
elif [ $# -eq 2 ]; then
    psql -h ec2-184-72-185-94.compute-1.amazonaws.com -p 5432 $1 -f $2
elif [ $# -eq 1 ]; then
    psql -h ec2-184-72-185-94.compute-1.amazonaws.com -p 5432 $1
fi

