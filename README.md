# usefulio:pipes
Compos-able processing pipelines

## Introduction
You can use Pipes to create _named_ pipelines of actions (functions) which are executed in sequence. The return value of each function (action) is passed as a parameter to the next function (action) in the sequence. The return value of a pipeline is the return value of the last action in the sequence. 

Multiple pipelines can also be executed in sequence with the return value of one pipeline passed as a parameter to the next one.  

## Usage
```javascript
// Creates a new pipe with three stages, before, action, and after
// all the before hooks should run, then all of the action hooks, then all of the after hooks
var myPipes = new Pipes(['before', 'action', 'after']);

// Attaches a hook (which is just a function) to the before pipeline.
myPipes.on('before', function (parameter) {
  return parameter + 1;
});

// Attaches a hook to the after pipeline
myPipes.on('after', function (parameter) {
  return parameter + 1;
});

// Runs all of the hooks, in order, passing as data to the first hook the number 1
// and as data to each subsequent hook the return value of the previous hook.
var result = myPipes.do(['before','after'], 1);

// result === 3; 1 + 1 + 1
```
