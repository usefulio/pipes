Tinytest.add('Pipes instance with default stages created', function (test) {
  var myPipe = new Pipes("stage1", "stage2", "stage3");

  test.equal(myPipe._stages.length === 3, true);
  test.equal(myPipe._stages[0] === "stage1", true);
  test.equal(myPipe._stages[1] === "stage2", true);
  test.equal(myPipe._stages[2] === "stage3", true);
});

Tinytest.add('Multi-action pipe with actions at multiple-stages created', function (test) {
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

Tinytest.add('Multi-action single-stage pipe executes and returns correct result', function (test) {
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

Tinytest.add('Single-action multi-stage pipe executes and returns correct result', function (test) {
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

Tinytest.add('Single-action multi-stage pipe executes and returns correct result (empty stage)', function (test) {
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

Tinytest.add('Multi-action multi-stage multiple-pipes executes and returns correct result (empty stage)', function (test) {
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