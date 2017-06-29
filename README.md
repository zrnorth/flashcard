## Local Setup

First: `npm install`. 

You'll need postgres installed: `brew install postgres`

To start a local db for development, in seperate tabs run:
```
postgres -D /usr/local/var/postgres
psql
```

In a server called `test`, make a table called `cards`:
```
create table cards(
    ID              SERIAL PRIMARY KEY      NOT NULL,
    FRONT           TEXT                    NOT NULL,
    BACK            TEXT                    NOT NULL,
    NEXT_REVIEW     DATE                    NOT NULL,
    DIFFICULTY      REAL                    NOT NULL,
    REPS            INT                     NOT NULL
);
```
Check `data/postgres.js:16` and make sure your local db information is input correctly. It should follow the format:
`postgres://USERNAME:PASSWORD@localhost:PORT/DB_NAME`

## Heroku development
The app uses the env variables `NODE_ENV` and `DATABASE_URL` to determine where to point the db. You can run locally against the cloud db by setting 
`NODE_ENV=PROD` and `export DATABASE_URL=$(heroku config:get DATABASE_URL -a YOUR_HEROKU_APP_NAME)`.

It will spit out errors if you need to update these.

## CLI
CLI stuff is in the `cli` folder. `npm link` to enable it.

Current commands: 
```
    count|ls             list the number of reviews for today
    start|go             start reviewing flashcards
    new                  make new flashcard(s), from direct input or a csv
    delete               delete a flashcard
```

## Webapp
Startup the web server by running `SET DEBUG=flashcard:* & npm run devstart`, then hit `localhost:3000`.

Check `routes/index.js` for routing info, or just click on the top bar to navigate.

## Tests
You can run some simple tests against a local db with `npm run test`. 

`npm run populate` creates random cards, `npm run clear` deletes them. Add `-prod` to the commands to run against your cloud db.