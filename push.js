const { exec } = require('child_process');
const colors = require('colors');
let message = "chore: update";
if (process.argv.length > 2) {
  message = process.argv.slice(2).join(" ");
}

const command = `git commit -am "${message}"  && git push origin master`;
console.log('debug command:', command);
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

push(command, function (err, response) {
  if (!err) {
    console.log(`Success push, repo updated...`.green);
    console.log(`Response : ${response}`.yellow)
  } else {
    console.log("Error", err)
  }
});