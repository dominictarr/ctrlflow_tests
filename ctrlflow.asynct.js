
var ctrl = require('ctrlflow')
  , it = require('it-is')


//
// you are allowed to use eval if and only if you cannot use closures.
//

function testSeq(evil, count) {
  function f (n) {
    called += 'number' === typeof n ? n : 1
    this.next()
  }
  var called = 0
  var args = [eval('(' + evil + ')')]

  exports[[evil,'=>',count].join(' ')] = function (test) {
    var go = ctrl.seq.apply(null,args)

    go(function () {
      it(called).equal(count)
      test.done()
    })
  }
}

testSeq("[f]", 1)
testSeq("{}", 0)
testSeq("[{}]", 0)
testSeq("[f, {}, f]", 2)
testSeq("[f, [f, 10]]", 11)
testSeq("[f,null]", 1)
testSeq("[f, null, f]", 2)
testSeq("[f, {A:null, B: f} , f]", 3)

testSeq("f", 1)
testSeq("{a:f, b: f, c: f}", 3)

