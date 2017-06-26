## Local Setup

First: `npm install`. 

You'll need postgres installed: `brew install postgres`

To start a local db for development, in seperate tabs run:
```
postgres -D /usr/local/var/postgres
psql
```

Make a table called cards:
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
Finally, make sure your `/data/connectionInfo.json` file has the correct information for your local server. You are good to go!

## CLI
CLI stuff is in the `cli` folder. `npm link` to enable it. All pointed at local postgres atm.

Current commands: 
```
    count|ls             list the number of reviews for today
    start|go             start reviewing flashcards
    new                  make new flashcard(s), from direct input or a csv
    delete               delete a flashcard
```

## Webapp
Startup the web server by running `SET DEBUG=flashcard:* & npm run devstart`, then hit `localhost:3000`.

Check `routes/index.js` for routing info.

## Tests
You can run some simple tests with `npm run test.` 

`npm run populate` creates random cards, `npm run clear` deletes them.