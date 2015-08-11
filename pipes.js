/**
 * Creates a Pipes instance. Pipes instances 
 * 
 * @constructor
 * @self pipes
 * @type Pipes
 * @param {Array} pipelineNames An ordered list of names for the consequent execution pipelines.
 *  The actions assigned to the first named pipeline will be executed initially, the actions assigned to the 2nd pipeline will be executed when pipeline one is completed etc.
 *  e.g. var myPipe = new Pipes ("before", "action", "after");
 *  "before" actions will be executed 1st, "action" 2nd and "after" 3rd.
 *  See the docs for Pipes.prototype.on on how to attach actions to pipelines. 
 */
Pipes = function () {
  var pipelines = _.flatten(_.toArray(arguments))

  var isEmpty = (pipelines.length < 1);
  var pipelineNamesAreNotStrings = !! _.find(pipelines, function (pipeline) { return ! _.isString(pipeline); });
  var pipelineNamesAreNotUnique = !! _.find(pipelines, function(pipeline, index, allPipelines) {
    var nameCount = _.filter(allPipelines, function (stg) { return stg === pipeline; });
    return nameCount.length != 1;
  });

  if ( isEmpty && pipelineNamesAreNotStrings ) {
    throw new Meteor.Error("invalid-arguments","pipelineNames argument does not exist or is not an Array");
  } else if ( pipelineNamesAreNotUnique ) {
    throw new Meteor.Error("duplicate-pipelinenames","pipelineNames must be unique");
  } else {
    this.pipelines = pipelines;
  }

  this.actions = {};

  var __actions = this.actions;
  _.each(pipelines, function(pipeline) {
    __actions[pipeline] = [];
  });
};

/**
 * Adds a new action to the predefined pipeline pipeline.
 *
 * @method  Pipes.prototype.on
 * @param {string} pipelineName The name of the pipeline
 * @param {function} action The new action. Each new action is added at the end of the pipeline i.e. will be executed last in the specific pipeline sequence.
 *
 */
 Pipes.prototype.on = function (pipelineName, action) {
  if (_.isString(action)) {
    action = (function (action) {
      return function (options) {
        return this.do(action, options);
      };
    })(action);
  }

  if (! _.has(this.actions, pipelineName))
    throw new Meteor.Error("invalid-pipelinename","pipelineName "+pipelineName+" is not defined");   

  this.actions[pipelineName].push(action);
};

/**
 * Executes all actions specified in each pipeline in order.   
 *
 * @method  Pipes.prototype.do
 * @param {string} pipelines An Array or a String containing the name (or names) of the pipelines to be executed. The pipelines are executed in the order that they appear in the array.
 * @param {object...} options The options for this pipeline sequence, passed as a parameter in the initial action. 
 *
 * @returns {object...} result The return result of the last action in the sequence.
 */
Pipes.prototype.do = function (pipelines, options) {
  var self = this;

  if (_.isString(pipelines))
    pipelines = [pipelines];

  if (pipelines && !_.isArray(pipelines))
    throw new Meteor.Error('do-invalid-pipelines','invalid pipelines, should be an array or a string');

  _.each(pipelines, function (pipeline) {
    if (!_.isString(pipeline))
      throw new Error('invalid pipeline, should be a string');
    var actions = self.actions[pipeline] || [];
    _.each(actions, function (action) {
      var result = action.call(self, options);
      options = result;
    });
  });

  return options;
};