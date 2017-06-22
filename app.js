const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname+'/frontend'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
})

app.get('/cards', function(req, res) {
    res.send('Hello there');
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000.');
})