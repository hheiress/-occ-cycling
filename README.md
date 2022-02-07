# OCCycling back end

## Setup local environment

### Prepare Database

Postgres server must be already up and running in your local environment before setting up the Database  
Open a terminal and go to base folder of the project. Then cd into `/back-end`  
Once there just run the command `setupDatabase.sh` passing Postgres installation username and password (if any). Like
```
./setupDatabase.sh postgress root
```

If there is no password just call the command with one argument:
```
./setupDatabase.sh postgress
```

This process is going to:  
· Reset database occycling  
· Create all the tables
· Seed some data  
· Create user pepe which is used internally by the application to connect to database

Of course this step needs to be executed only once. Or every time you want to reset the DB.

### Start Back end server

Assuming that the Database occycling and the user pepe have been created, simply go
to `/back-end` and run:  
```
node server.js
```

Will start an express server listening by default in port 3000