Tinytest.add('Single-pipeline Pipe instance created', function (test) {
  var myPipe = new Pipes("pipeline1");

  test.equal(myPipe.pipelines.length === 1, true);
  test.equal(myPipe.pipelines[0] === "pipeline1", true);
});

Tinytest.add('Multi-pipeline Pipe instance created', function (test) {
  var myPipe = new Pipes(["pipeline1","pipeline2"]);

  test.equal(myPipe.pipelines.length === 2, true);
  test.equal(myPipe.pipelines[0] === "pipeline1", true);
  test.equal(myPipe.pipelines[1] === "pipeline2", true);
});

Tinytest.add('Single-action is added to Pipe pipeline', function (test) {
  var myPipe = new Pipes("pipeline1");

  myPipe.on("pipeline1", function (options) {
    return options;
  });

  test.equal(myPipe.actions["pipeline1"].length === 1, true);
  test.equal(typeof myPipe.actions["pipeline1"][0] === 'function', true);
});

Tinytest.add('Multiple-actions are added to multiple pipelines', function (test) {
  var myPipe = new Pipes(["pipeline1","pipeline2"]);

  myPipe.on("pipeline1", function (options) {
    return options;
  });

  myPipe.on("pipeline2", function (options) {
    return options;
  });

  test.equal(myPipe.actions["pipeline1"].length === 1, true);
  test.equal(myPipe.actions["pipeline2"].length === 1, true);
  test.equal(typeof myPipe.actions["pipeline1"][0] === 'function', true);
  test.equal(typeof myPipe.actions["pipeline2"][0] === 'function', true);
});

Tinytest.add('Single-action is executed and returns result', function (test) {
  var myPipe = new Pipes("pipeline1");

  myPipe.on("pipeline1", function (options) {
    return options;
  });

  var result = myPipe.do("pipeline1", "this_is_my_option");

  test.equal(result === "this_is_my_option", true);
});

Tinytest.add('Multiple-actions are executed in single pipeline; options are passed from action to action', function (test) {
  var myPipe = new Pipes("pipeline1");

  myPipe.on("pipeline1", function (options) {
    return options+"is_";
  });

  myPipe.on("pipeline1", function (options) {
    return options+"my_option";
  });

  var result = myPipe.do("pipeline1", "this_");
  test.equal(result === "this_is_my_option", true);
});

Tinytest.add('Multiple-actions are executed in multiple pipelines and return results in correct order', function (test) {
  var myPipe = new Pipes(["pipeline1", "pipeline2"]);

  myPipe.on("pipeline1", function (options) {
    return options+"this_";
  });

  myPipe.on("pipeline1", function (options) {
    return options+"is_";
  });
  myPipe.on("pipeline2", function (options) {
    return options+"my_";
  });

  myPipe.on("pipeline2", function (options) {
    return options+"option";
  });

  var result = myPipe.do(["pipeline1", "pipeline2"], "");
  test.equal(result === "this_is_my_option", true);
});
