/**
 * Creates a Pipe instance. 
 * 
 * @constructor  Pipe
 * @self Pipe
 * @type Pipe
 * @param {Array} stageNames An ordered list of default stages for all the Pipes that are created.
 *  The actions assigned to the first named stage will be executed initially, the actions assigned to the 2nd stage will be executed when stage one is completed etc.
 *  e.g. 
 *  ```
 *  var myPipe = new Pipe ("before", "action", "after");
 *  myPipe.on("default","before",function (options) {
 *   return options;
 *  });
 *
 *  myPipe.on("default","action",function (options) {
 *   return options;
 *  });
 *  ...
 *  ```
 *  "before" actions will be executed 1st, "action" 2nd and "after" 3rd.
 *  See the docs for Pipe.prototype.on on how to attach actions to Pipe. 
 */
Pipe = function () {
  var stages = _.flatten(_.toArray(arguments))

  var isEmpty = (stages.length < 1);
  var stageNamesAreNotStrings = !! _.find(stages, function (stage) { return ! _.isString(stage); });
  var stageNamesAreNotUnique = ( _.uniq(stages).length != stages.length );

  if ( isEmpty || stageNamesAreNotStrings ) {
    throw new Meteor.Error("invalid-arguments","stageNames argument does not exist or is not an array of strings");
  } else if ( stageNamesAreNotUnique ) {
    throw new Meteor.Error("duplicate-stagenames","stageNames must be unique");
  } else {
    this._stages = stages;
  }

  this.actions = {};
};

/**
 * Adds a new action to one of the predefined stages for a pipe.
 *
 * @method  Pipe.prototype.on
 * @param {string} pipeName The name of the pipe
 * @param {string} stageName The name of the stage. This affects the order of execution. See docs on Pipe constructor for more.  
 * @param {function, array or string} action The new action.  
 *  (function) Each new action is added at the end of the stage i.e. will be executed last in the specific stage sequence for the specified pipe. 
 *  (string) A string wih the name of an existing named pipe can also be passed as an action, allowing the combination of several pipes like moduels into aggregate pipes 
 *  (array) An array of functions (actions), strings (pipe names) or any combination of the two. The actions will be executed in the same order that they appear in the array.  
 */
 Pipe.prototype.on = function (pipeName, stageName) { 
  var self = this;
  var action = _.flatten(_.toArray(arguments)).slice(2);

  if (_.indexOf(self._stages, stageName) === -1)
    throw new Meteor.Error("invalid-stagename","stageName "+stageName+" is not defined");   

  var cue = self.actions[pipeName] || {};
  cue[stageName] = cue[stageName] || [];

  _.each(action, function (singleAction) {
    if (_.isString(singleAction)) {
      singleAction = (function (singleAction) {
        return function (options) { return self.do(singleAction, options); };
      })(singleAction);
      cue[stageName].push(singleAction);
    } else if (_.isFunction(singleAction)) {
      cue[stageName].push(singleAction);        
    } else {
      throw new Meteor.Error("invalid-action","action is not a string or a function");   
    }
  });

  self.actions[pipeName] = cue;
};

/**
 * Executes all actions specified in a pipe for all defined stages, in order.   
 *
 * @method  Pipe.prototype.do
 * @param {string} pipeName The name of the pipe to be executed. 
 * @param {object...} options The options for this pipe sequence, passed as a parameter to the initial action. 
 *
 * @returns {object...} result The return result of the last action in all the includes stage action sequences.
 */
Pipe.prototype.do = function (pipeName, options) {
  var self = this;

  if (! _.isString(pipeName) || ! self.actions[pipeName])
    throw new Meteor.Error('invalid-pipename','pipeName does not exist or is not a string');

  var action = self.actions[pipeName] || {};
  _.each(self._stages, function (stageName) {
    var actions = action[stageName] || [];
      _.each(actions, function (action) {
        var result = action.call(self, options);
        options = result;
      });
  });

  return options;
};