First: `npm install`.

To start a local db for development, in seperate tabs run:
```
postgres -D /usr/local/var/postgres
psql
```

Run code in the `test` dir to test out db functions.

CLI stuff is in the `cli` folder. `npm link` to enable it.

Current commands: 
```
    reviews|r            list the number of reviews for today
    start|go             start reviewing flashcards
    new [front] [back]   make a new flashcard
    delete [front]       delete a flashcard with the given front side
```