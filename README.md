## Local Setup

First: `npm install`. 

You'll need postgres installed: `brew install postgres`

To start a local db for development, in seperate tabs run:
```
postgres -D /usr/local/var/postgres
psql
```
some reminders for psql:
```
\l lists all databases
\c DATABASE connects to a database
\dt lists all tables in the db
\d+ TABLE lists columns in a table
```

In a server called `test`, make these tables:
```
create table users(
    ID              SERIAL PRIMARY KEY          NOT NULL,
    USERNAME        VARCHAR(200)                NOT NULL UNIQUE,
    PASSWORD        VARCHAR(100)                NOT NULL
);

create table cards(
    ID              SERIAL PRIMARY KEY          NOT NULL,
    FRONT           TEXT                        NOT NULL,
    BACK            TEXT                        NOT NULL,
    NEXT_REVIEW     DATE                        NOT NULL,
    DIFFICULTY      REAL                        NOT NULL,
    REPS            INT                         NOT NULL,
    OWNER_ID        INT REFERENCES users(ID)    ON DELETE CASCADE NOT NULL,
    UNIQUE(FRONT, BACK, OWNER_ID)
);

create table kanji_lookup(
    KLC_INDEX       INT PRIMARY KEY             NOT NULL,
    KANJI           TEXT                        NOT NULL,
    HEISIG          TEXT                        NOT NULL,
    ENGLISH         TEXT
);

```
You can populate the kanji_lookup table with the kanji data by running this in psql:
```
COPY kanji_lookup FROM '/path/to/root/heisig.csv' DELIMITER ',' CSV HEADER;
```


Check `data/postgres.js:16` and make sure your local db information is input correctly. It should follow the format:
`postgres://USERNAME:PASSWORD@localhost:PORT/DB_NAME`

## Heroku development
The app uses the env variables `NODE_ENV` and `DATABASE_URL` to determine where to point the db. You can run locally against the cloud db by setting 
`NODE_ENV=PROD` and `export DATABASE_URL=$(heroku config:get DATABASE_URL -a YOUR_HEROKU_APP_NAME)`.

`heroku pg:psql` to connect to the cloud (prod) db.

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
CLI currently doesn't have login information, so you just set the user id manually.

## Webapp
Startup the web server by running `SET DEBUG=flashcard:* & npm run devstart`, then hit `localhost:3000`.

Check `routes/index.js` for routing info, or just click on the top bar to navigate.

## Tests
You can run some simple tests against a local db with `npm run test`. 

`npm run populate --userId=USER_ID --numCards=NUMBER_OF_CARDS` creates random cards, `npm run clear --userId=USER_ID` deletes them. Run `populate-prod` or `clear-prod` instead to run against your cloud db.