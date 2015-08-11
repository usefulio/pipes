# usefulio:pipes
Compos-able processing pipelines

## Introduction
You can use Pipes to create pipelines of actions (functions) which are executed in sequence. The return value of each function (action) is passed as a parameter to the next function (action) in the sequence. The return value of a pipeline is the return value of the last action in the sequence. 

By specifying multiple named _stages_ you can also group pipelines of actions in e.g. 'before', 'action' and 'after' actions, or in any other naming scheme you like. 
Stage-grouped actions are executed in sequence with the return value of one stage passed as a parameter to the next one.  

## Usage
```javascript
// Creates a new pipe with three stages, before, action, and after. These are executed in the order they 
// appear in the array.
// For a given Pipe (in this example the pipe named'default' specified during the myPipes.on method calls) 
// all the before hooks run first, then all of the action hooks, then all of the after hooks
var myPipes = new Pipes(['before', 'action', 'after']);

// Attaches a hook (which is just a function) to the 'before' stage of 'default' pipe.
myPipes.on('default','before', function (parameter) {
  return parameter + 1;
});

// Attaches a hook to the after stage
myPipes.on('default','after', function (parameter) {
  return parameter + 1;
});

// Runs all of the hooks, in order, passing as data to the first hook the number 1
// and as data to each subsequent hook the return value of the previous hook.
var result = myPipes.do('default', 1);

// result === 3; 1 (original) + 1 (hook 1) + 1 (hook 2)
```
