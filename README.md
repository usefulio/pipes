# pipes
Compos-able processing pipelines

```javascript
// Creates a new pipe with three stages, before, action, and after
// all the before hooks should run, then all of the action hooks, then all of the after hooks
var myPipe = new Pipe(['before', 'action', 'after']);

// Attaches an action hook (which is just a function) to the default route.
myPipe.on('default', 'action', function (message) {
  console.log("This is the first action for the default route, message:", message);
  return message;
});

// Attaches an after hook to the default route
myPipe.on('default', 'after', function (message) {
  console.log('sent', message) // should log the message after it has been run through the default action.
});

// Runs all of the hooks for the default route, in order, passing as data to the first hook
// 'This is my message' and as data to each subsequent hook the return value of the previous
// hook.
myPipe.do('default', "This is my message");

```
