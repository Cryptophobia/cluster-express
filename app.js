// Including the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process:
if(cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for(var i = 0; i < cpuCount; i += 1){
    cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function(worker) {
    // Replace the dead worker, we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

  });
}

// Code to run if we're in the worker process:

else {
  var express = require('express');

  var app  = express();
  var PORT = 3000;

  // Adding one basic route
  app.get('/', function(req, res) {
    res.send('Hello from Worker ' + cluster.worker.id);
  });

  // Bind to port
  app.listen(PORT);
  console.log(`Application listening on port: ${PORT} - `, cluster.worker.id);
}
