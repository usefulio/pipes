Tinytest.add('Pipes instance with default stages created', function (test) {
  var myPipe = new Pipes("stage1", "stage2", "stage3");

  test.equal(myPipe._stages.length === 3, true);
  test.equal(myPipe._stages[0] === "stage1", true);
  test.equal(myPipe._stages[1] === "stage2", true);
  test.equal(myPipe._stages[2] === "stage3", true);
});

Tinytest.add('Multi-action cue with actions at multiple-stages created', function (test) {
  var myPipe = new Pipes(["stage1","stage2","stage3"]);

  myPipe.on("default","stage1",function (options) {
    return options;
  });

  myPipe.on("default","stage2",function (options) {
    return options;
  });

  myPipe.on("default","stage3",function (options) {
    return options;
  });

  test.equal(!! myPipe.actions["default"], true);
  test.equal(!! myPipe.actions["default"]["stage1"], true);
  test.equal(!! myPipe.actions["default"]["stage2"], true);
  test.equal(!! myPipe.actions["default"]["stage3"], true);
  test.equal(typeof myPipe.actions["default"]["stage1"][0] === 'function', true);
  test.equal(typeof myPipe.actions["default"]["stage2"][0] === 'function', true);
  test.equal(typeof myPipe.actions["default"]["stage3"][0] === 'function', true);
});

Tinytest.add('Multi-action single-stage cue executes and returns correct result', function (test) {
  var myPipe = new Pipes("stage1");

  myPipe.on("default","stage1",function (options) {
    return options+" had";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" a little";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" lamb";
  });

  var result = myPipe.do("default","Mary");
  test.equal(result === 'Mary had a little lamb', true);
});

Tinytest.add('Single-action multi-stage cue executes and returns correct result', function (test) {
  var myPipe = new Pipes("stage1","stage2","stage3");

  myPipe.on("default","stage3",function (options) {
    return options+" lamb";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" had";
  });

  myPipe.on("default","stage2",function (options) {
    return options+" a little";
  });

  var result = myPipe.do("default","Mary");
  test.equal(result === 'Mary had a little lamb', true);
});

Tinytest.add('Single-action multi-stage cue executes and returns correct result (empty stage)', function (test) {
  var myPipe = new Pipes("stage1","stage2","stage3");

  myPipe.on("default","stage3",function (options) {
    return options+" lamb";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" had a little";
  });

  var result = myPipe.do("default","Mary");
  test.equal(result === 'Mary had a little lamb', true);
});

Tinytest.add('Multi-action multi-stage multiple-cues executes and returns correct result (empty stage)', function (test) {
  var myPipe = new Pipes("stage1","stage2","stage3");

  myPipe.on("default","stage3",function (options) {
    return options+" little";
  });
  myPipe.on("default","stage3",function (options) {
    return options+" lamb";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" had";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" a";
  });

  var result = myPipe.do("default","Mary");
  test.equal(result === 'Mary had a little lamb', true);
});


// Tinytest.add('Single-action is executed and returns result', function (test) {
//   var myPipe = new Pipes("pipeline1");

//   myPipe.on("pipeline1", function (options) {
//     return options;
//   });

//   var result = myPipe.do("pipeline1", "this_is_my_option");

//   test.equal(result === "this_is_my_option", true);
// });

// Tinytest.add('Multiple-actions are executed in single pipeline; options are passed from action to action', function (test) {
//   var myPipe = new Pipes("pipeline1");

//   myPipe.on("pipeline1", function (options) {
//     return options+"is_";
//   });

//   myPipe.on("pipeline1", function (options) {
//     return options+"my_option";
//   });

//   var result = myPipe.do("pipeline1", "this_");
//   test.equal(result === "this_is_my_option", true);
// });

// Tinytest.add('Multiple-actions are executed in multiple pipelines and return results in correct order', function (test) {
//   var myPipe = new Pipes(["pipeline1", "pipeline2"]);

//   myPipe.on("pipeline1", function (options) {
//     return options+"this_";
//   });

//   myPipe.on("pipeline1", function (options) {
//     return options+"is_";
//   });
//   myPipe.on("pipeline2", function (options) {
//     return options+"my_";
//   });

//   myPipe.on("pipeline2", function (options) {
//     return options+"option";
//   });

//   var result = myPipe.do(["pipeline1", "pipeline2"], "");
//   test.equal(result === "this_is_my_option", true);
// });
