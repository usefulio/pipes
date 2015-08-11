/**
 * Creates a Pipes instance. Pipes instances 
 * 
 * @constructor
 * @self pipes
 * @type Pipes
 * @param {Array} stageNames An ordered list of default stages for all the pipes that are created.
 *  The actions assigned to the first named stage will be executed initially, the actions assigned to the 2nd stage will be executed when stage one is completed etc.
 *  e.g. 
 *  ```
 *  var myPipe = new Pipes ("before", "action", "after");
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
 *  See the docs for Pipes.prototype.on on how to attach actions to pipes. 
 */
Pipes = function () {
  var stages = _.flatten(_.toArray(arguments))

  var isEmpty = (stages.length < 1);
  var stageNamesAreNotStrings = !! _.find(stages, function (stage) { return ! _.isString(stage); });
  var stageNamesAreNotUnique = !! _.find(stages, function(stage, index, allPipelines) {
    var nameCount = _.filter(allPipelines, function (stg) { return stg === stage; });
    return nameCount.length != 1;
  });

  if ( isEmpty && stageNamesAreNotStrings ) {
    throw new Meteor.Error("invalid-arguments","stageNames argument does not exist or is not an Array");
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
 * @method  Pipes.prototype.on
 * @param {string} pipeName The name of the pipe
 * @param {string} stageName The name of the stage. This affects the order of execution. See docs on Pipes constructor for more.  
 * @param {function} action The new action. Each new action is added at the end of the stage i.e. will be executed last in the 
 * specific stage sequence for the specified pipe.
 *
 */
 Pipes.prototype.on = function (pipeName, stageName, action) {
  var self = this;
  if (_.isString(action)) {
    action = (function (action) {
      return function (options) {
        return this.do(action, options);
      };
    })(action);
  }

  if (_.indexOf(self._stages, stageName) === -1)
    throw new Meteor.Error("invalid-stagename","stageName "+stageName+" is not defined");   

  var cue = self.actions[pipeName] || {};
  cue[stageName] = cue[stageName] || [];
  cue[stageName].push(action);
  self.actions[pipeName] = cue;
};

/**
 * Executes all actions specified in a pipe for all defined stages, in order.   
 *
 * @method  Pipes.prototype.do
 * @param {string} pipeName The name of the pipe to be executed. 
 * @param {object...} options The options for this pipe sequence, passed as a parameter to the initial action. 
 *
 * @returns {object...} result The return result of the last action in all the includes stage action sequences.
 */
Pipes.prototype.do = function (pipeName, options) {
  var self = this;

  if (! _.isString(pipeName))
    throw new Meteor.Error('do-invalid-pipeName','invalid pipeName, should be a string');

  var _activeStages = _.filter(self._stages, function (stageName) {
    return self.actions[pipeName] && _.has(self.actions[pipeName], stageName) 
  });

  _.each(_activeStages, function (stageName) {
    var actions = self.actions[pipeName][stageName] || [];
    _.each(actions, function (action) {
      var result = action.call(self, options);
      options = result;
    });
  });

  return options;
};