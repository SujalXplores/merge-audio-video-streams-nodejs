// process.env.PORT lets the port be set by Heroku
const port = 3333;

//load express
const express = require('express');

const ejs = require("ejs");

const app = express();

//display these files statically as they are
app.use('/public', express.static(__dirname+'/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

//use routes
app.use('/', require('./routes/index'));
app.use('/video', require('./routes/video'));

app.listen(port, () => {
  console.log(`Server up on port ${port}`);
});