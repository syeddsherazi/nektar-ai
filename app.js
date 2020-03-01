const express = require('express');
const bodyParser = require('body-parser');
const log = require('./routes/log');

const app = express();

/*

* example.txt file having logs is kept in static/example.txt location

* DIDN'T USE ANY NPM MODULE FOR THE CORE TASK OF READING AND FILTERING FROM
  THE TEXT FILE.
  USED EXPRESSJS FOR JUST THE BASIC SERVER SETUP

* HAVE KEPT THE HIERARCHY TO MINIMUM:
    1. ROUTES FILE FOR LOGS IN ROUTES FOLDER
    2. A CONTROLLER FILE FOR LOGS IN CONTROLLER FOLDER
    3. STATIC FOLDER TO HAVE FILES, E.G. OUR EXAMPLE.TXT FILE

* COULD HAVE ORGANIZED THE PROJECT INTO BETTER HIERARCHY, BUT THE SCOPE OF ASSIGNMENT DIDN'T REQUIRE IT

*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/logs', log);

let port = 3003;

app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});
