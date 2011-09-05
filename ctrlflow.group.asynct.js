
var ctrl = require('ctrlflow')
  , it = require('it-is')
  , d = require('d-utils/async')

exports.group2 = function (test){
  var called = 0
  function timeout (ms) {
    return function (){
      called ++
      setTimeout(this.next,100)
    }
  }
  
  var g = ctrl.group({
    a: timeout(100),
    b: timeout(50),
    c: timeout(150)
  }, function (err,results){
    it(err).equal(null)
    it(called).equal(3)
    it(results).has({
      a: []
    , b: []
    , c: []
    })
    test.done()
  })  
}

exports['group can be seq array'] = function (test){
  var called = 0
  var g = ctrl.group({
    a: [function () {
      called ++
      d.delay(this.next,100)(null, "A")
    }],
    b: [function () {
      called ++
      d.delay(this.next,50)(null, "B")
    }],
    c: [function () {
      called ++
      d.delay(this.next,150)(null, "C")
    }]
  }, function (err,results){
    it(err).equal(null)
    it(called).equal(3)
    it(results).has({
      a: it.deepEqual(["A"])
    , b: it.deepEqual(["B"])
    , c: it.deepEqual(["C"])
    })
    test.done()
  })  
}

exports['group can be seq array - edgecase'] = function (test){
  var called = 0
  var g = ctrl.group({
    a: [function (){
      called ++
      setTimeout(this.next,100)
    }]
  }, function (err,results){
    it(err).equal(null)
    it(called).equal(1)
    it(results).has({
      a: []
    })
    test.done()
  })  
}

exports['seq can take parallel group'] = function (test) {
  var called = 0
    , go = ctrl.seq([
    { a: [function (){
        called ++
        setTimeout(this.next,100)
      }]
    }, function (results) {
        called += 10
        it(results).has({
          a: []
        })
        this.next()
    }])
    
  go(function (err,results){
    if (err)  throw err
    it(called).equal(11)
    test.done()
  })
}

exports['group can be seq array - edgecase'] = function (test){
  var called = 0
    , count = 0
    
  function f (add, cb) {
    called ++
    if('number' == typeof add)
      count += add
    this.next()
  }
  var g = ctrl.group({
    a: f,
    b: [f,f,f],
    c: [[f, 10],[f, 20]],
    /*d: {
      A: f,
      B: [[f, 30], f]
    }*/
  }, function (err,results){
    if(err) throw err
    it(called).equal(6)
    it(count).equal(30)
    it(results).has({
      a: []
    })
    test.done()
  })  
}

exports['group can be seq array - edgecase'] = function (test){
  var called = 0
    , count = 0
    
  function f (add, cb) {
    called ++
    if('number' == typeof add)
      count += add
    this.next()
  }
  var go = ctrl.group({
    a: f,
    b: [f,f,f],
    c: [[f, 10],[f, 20]],
    d: [f, {
      A: f,
      B: [[f, 30], f]
    }]
  })
  
  go(function (err, results) {
    if(err) throw err
    it(called).equal(10)
    it(count).equal(60)
    it(results).has({
      a: []
    })
    test.done()
  })  
}
