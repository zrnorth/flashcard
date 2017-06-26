First: `npm install`.

To start a local db for development, in seperate tabs run:
```
postgres -D /usr/local/var/postgres
psql
```

CLI stuff is in the `cli` folder. `npm link` to enable it. All pointed at local postgres atm.

Current commands: 
```
    count|ls             list the number of reviews for today
    start|go             start reviewing flashcards
    new                  make new flashcard(s), from direct input or a csv
    delete               delete a flashcard
```

You can run some simple tests with `npm run test.` 

`npm run populate` creates random cards, `npm run clear` deletes them.

Startup the web server by running `SET DEBUG=flashcard:* & npm run devstart`, then hit `localhost:3000`.

Check `routes/index.js` for routing info.