const { exec } = require('child_process');

let message = 'chore: update';
if (process.argv.length > 2) {
  message = process.argv.slice(2).join(" ");
}

const command = `git commit -am ${message} && git push origin master`;
console.log('test command:', command);

const push = function (command, callback) {
  exec(command, function (err, stdout, stderr) {
    if (err !== null) {
      return callback(new Error(err), null);
    } else if (typeof (stderr) !== 'string') {
      return callback(new Error(stderr), null)
    } else {
      return callback(null, stdout);
    }
  })
}

push('git add . && git commit -m "add a script for pushing to repo"', function (err, response) {
  if (!err) {
    console.log("Success...", response);
  } else {
    console.log("Error". err)
  }
});