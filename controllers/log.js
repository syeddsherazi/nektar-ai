/*

An example endpoint with all passing parameters will be 
http://localhost:3003/logs?endDate=2020-01-18T07:30:58.156Z&startDate=2020-01-01T00:00:11.172Z&page=99

Query Params:
startDate: optional
endDate: optional
page: its the page number to get
      if not sent will receive page 0 will be returned by default, 
      empty logs at any request means no logs within specified period




Notes:

* For Pagintation, have kept resultant page size to be of 500. Variable can be changed.

* For ideal pagination, total count of items matching criteria was to be returned,
  but in this specific instance reading all the valid log items to get total count
  would have resulted in performance degradation without any need.
  
  So front end will have to cater with the requirement that if empty logs array returned,
  then it means no more items matching criteria

*/

var fs = require('fs');

// IF FILTER TIME RANGE PASSED
// FUNCTION TO CHECK WHETHER LOG ITEM IS WITHIN DATE RANGE
const isWithin = function(startDate, endDate, logDate) {
  if (startDate && endDate && logDate >= startDate && logDate <= endDate) {
    return true;
  } else if (startDate && !endDate && logDate >= startDate) {
    return true;
  } else if (!startDate && endDate && logDate <= endDate) {
    return true;
  }
  return false;
};

exports.list = async function(req, res, next) {
  try {
    let startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    let endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    let page = req.query.page ? req.query.page : 0;
    const filename = 'static/example.txt';

    // Since the logs are in order, reading the file synchronoulsy in small buffers
    let fd = fs.openSync(filename, 'r');
    let bufferSize = 1024;
    let buffer = new Buffer(bufferSize);
    let leftOver = '';
    let read, line, idxStart, idx;

    let count = 0; // Number of returning items
    let logs = []; // Logs array to return
    let isDone = false; // Boolean to check whether end date limit surpassed
    let pageSize = 500; // Page Size kept at 500 items
    let itemsToSkip = page * pageSize; // Initial items to skip from ascending order. Done for pagination
    let skippedItems = 0; // Skipped items for pagination

    // While the file doesn't end
    // Or any of the filter criteria isn't violated keep reading file in buffers
    while (
      (read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0 &&
      count < pageSize &&
      !isDone
    ) {
      leftOver += buffer.toString('utf8', 0, read);
      idxStart = 0;

      // While buffer reading is in progress, read line by line
      while (
        (idx = leftOver.indexOf('\n', idxStart)) !== -1 &&
        count < pageSize &&
        !isDone
      ) {
        // Get a particular line
        line = leftOver.substring(idxStart, idx);

        // Log date, first item of line
        let logDate = new Date(line.substr(0, line.indexOf(' ')));

        // Check if log date lies within the query date params criteria
        if (isWithin(startDate, endDate, logDate)) {
          if (skippedItems >= itemsToSkip) {
            count++;
            logs.push({
              date: line.substr(0, line.indexOf(' ')),
              log: line.substr(line.indexOf(' ') + 1)
            });
          } else {
            skippedItems++;
          }
        }

        // If end date is surpassed ( checked only when passed )
        if (endDate && logDate > endDate) {
          isDone = true;
        }

        idxStart = idx + 1;
      }

      // Left over buffer string
      leftOver = leftOver.substring(idxStart);
    }

    res.send({ count, logs });
  } catch (err) {
    next(err);
  }
};
