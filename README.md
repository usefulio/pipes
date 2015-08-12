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
// For a given Pipe (in this example the pipe named'default' specified during the myPipe.on method calls) 
// all the before hooks run first, then all of the action hooks, then all of the after hooks
var myPipe = new Pipe(['before', 'action', 'after']);

// Attaches a hook (which is just a function) to the 'before' stage of 'default' pipe.
myPipe.on('default','before', function (parameter) {
  return parameter + 1;
});

// Attaches a hook to the after stage
myPipe.on('default','after', function (parameter) {
  return parameter + 1;
});

// Runs all of the hooks, in order, passing as data to the first hook the number 1
// and as data to each subsequent hook the return value of the previous hook.
var result = myPipe.do('default', 1);

// result === 3; 1 (original) + 1 (hook 1) + 1 (hook 2)
```
## Assigning multiple actions at once
You can use the `Pipe.on` method to assign several actions at once, passing all actions in an array or as arguments. e.g.

### As an array
```
  myPipe.on("default","stage1",[
    function (options) {
      ... // 1st action
      return options;
    }, 
    function (options) {
      ... // 2nd action
      return options;
    },
    function (options) {
      ... // 3rd action
      return options;
    }
  ]);
```

### As arguments
```
  myPipe.on("default", "stage1",
    function (options) {
      ... // 1st action
      return options;
    }, 
    function (options) {
      ... // 2nd action
      return options;
    },
    function (options) {
      ... // 3rd action
      return options;
    } 
  );
```

## Using pipes as actions to create combo pipes
Any pipe that you create with `Pipe.on` method call can then be referenced in another `Pipe.on` method call by name in order to create Pipes of greater complexity. 
This is a powerful feature since it allows you to create reusable sets of actions and combine them at will to create higher level Pipes. 
To do that you simply replace any function definition with a string containing the name of the pipe you want to reference. e.g. 
```
  myPipe.on("subPipe", "stage1",
    function (options) {
      ... // 2nd action
      return options;
    },
    function (options) {
      ... // 3rd action
      return options;
    } 
  );

  myPipe.on("default", "stage1",
    function (options) {
      ... // 1st action
      return options;
    }, 
    "subPipe" // note the use of the pipe name here
  )


  myPipe.do("default", options); // this will run the three actions in the correct sequence
```

See the following example to understand the order of execution when passing pipes by reference. 
e.g. with 2 stages: `before`, `after`
```
  var myPipe = new Pipe("stage1", "stage2")
  myPipe.on("subPipe", "stage1", function(options) { console.log("2"); return options;});
  myPipe.on("subPipe", "stage2", function(options) { console.log("3"); return options;});

  myPipe.on("mainPipe", "stage1", function(options) { console.log("1"); return options;}, "subPipe");
  myPipe.on("mainPipe", "stage2", function(options) { console.log("4"); return options;});

  myPipe.do("mainPipe", options); // result 1 2 3 4
```
whereas:
```
  var myPipe = new Pipe("stage1", "stage2")
  myPipe.on("subPipe", "stage1", function(options) { console.log("2"); return options;});
  myPipe.on("subPipe", "stage2", function(options) { console.log("3"); return options;});

  myPipe.on("mainPipe", "stage1", function(options) { console.log("1"); return options;});
  myPipe.on("mainPipe", "stage2", function(options) { console.log("4"); return options;}, "subPipe");

  myPipe.do("mainPipe", options); // result 1 4 2 3
```
In other words: all stages of a referenced pipe are executed in order exactly at the point where it is referenced. 