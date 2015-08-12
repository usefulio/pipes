Tinytest.add('Pipe instance with default stages created', function (test) {
  var myPipe = new Pipe("stage1", "stage2", "stage3");

  test.equal(myPipe._stages.length === 3, true);
  test.equal(myPipe._stages[0] === "stage1", true);
  test.equal(myPipe._stages[1] === "stage2", true);
  test.equal(myPipe._stages[2] === "stage3", true);
});

Tinytest.add('Multi-action pipe with actions at multiple-stages created', function (test) {
  var myPipe = new Pipe(["stage1","stage2","stage3"]);

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

Tinytest.add('Multi-action single-stage pipe executes and returns correct result', function (test) {
  var myPipe = new Pipe("stage1");

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
  test.equal(result, 'Mary had a little lamb');
});

Tinytest.add('Single-action multi-stage pipe executes and returns correct result', function (test) {
  var myPipe = new Pipe("stage1","stage2","stage3");

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
  test.equal(result, 'Mary had a little lamb');
});

Tinytest.add('Single-action multi-stage pipe executes and returns correct result (empty stage)', function (test) {
  var myPipe = new Pipe("stage1","stage2","stage3");

  myPipe.on("default","stage3",function (options) {
    return options+" lamb";
  });

  myPipe.on("default","stage1",function (options) {
    return options+" had a little";
  });

  var result = myPipe.do("default","Mary");
  test.equal(result, 'Mary had a little lamb');
});

Tinytest.add('Multi-action multi-stage multiple-Pipes executes and returns correct result (empty stage)', function (test) {
  var myPipe = new Pipe("stage1","stage2","stage3");

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
  test.equal(result, 'Mary had a little lamb');
});

// ###############################################################
// ###############################################################
// ## Errors handling
// ###############################################################
// ###############################################################

Tinytest.add('Errors - Pipe instance with non unique stage names throws error', function (test) {
  var errorThrown = false;
  try {
    var myPipe = new Pipe("stage1", "stage1", "stage3");
  } catch (err) {
    errorThrown = err;
  }

  test.equal(errorThrown.error, "duplicate-stagenames");
});

Tinytest.add('Errors - Pipe instance with invalid or non-existent stage names throws error', function (test) {
  var errorThrown = false;
  try {
    var myPipe = new Pipe();
  } catch (err) {
    errorThrown = err;
  }
  test.equal(errorThrown.error, "invalid-arguments");

  errorThrown = false;
  try {
    var myPipe = new Pipe("stage1", 123);
  } catch (err) {
    errorThrown = err;
  }
  test.equal(errorThrown.error, "invalid-arguments");
});

Tinytest.add('Errors - undefined stage name when an action is assigned throws error', function (test) {
  var errorThrown = false;
  var myPipe = new Pipe("stage1");
  try {
    myPipe.on("default","stage2",function (options) {
      return options;
    });
  } catch (err) {
    errorThrown = err;
  }

  test.equal(errorThrown.error, "invalid-stagename");
});

Tinytest.add('Errors - undefined pipe name when a pipe is executed throws error', function (test) {
  var errorThrown = false;
  var myPipe = new Pipe("stage1");
  myPipe.on("default","stage1",function (options) {
    return options;
  });
  
  try {
    myPipe.do("otherPipe","random option");
  } catch (err) {
    errorThrown = err;
  }
  test.equal(errorThrown.error, "invalid-pipename");

  try {
    myPipe.do(123,"random option");
  } catch (err) {
    errorThrown = err;
  }
  test.equal(errorThrown.error, "invalid-pipename");

});
