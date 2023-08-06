host=user-database
port=5432


while ! nc -z $host $port; do   
  sleep 0.1 
done

npx knex migrate:latest

node ./src/index.js