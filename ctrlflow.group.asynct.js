
var ctrl = require('ctrlflow')
  , it = require('it-is')
  , curry = require('curry')

exports.group = function (test){
  var g = ctrl.group(function (err,results){
    it(err).equal(null)
    it(results).property('length',3)
    test.done()
  })
  
  setTimeout(g(),100)
  setTimeout(g(),50)
  setTimeout(g(),150)
  
}

exports['group with error'] = function (test){
  var error = new Error("ERR")
    , g = ctrl.group(function (err,results){
    it(err).equal(error)
    it(results).property('length',3)
    test.done()
  })

  setTimeout(g(),100)
  f = g()
  setTimeout(function () {
    f(error)
  },50)
  setTimeout(g(),150)
}

exports['group with args'] = function (test){
  var error = new Error("ERR")
    , g = ctrl.group(function (err,results){
    it(err).equal(error)
    it(results).property('length',3)
    it(results).has([
      [null,1,2,3]
    , [it.equal(error),"message!"]
    , [null,{obj: 54}]
    ])
    test.done()
  })

  setTimeout(curry(g(),[null,1,2,3]),100)
  setTimeout(curry(g(),[error,"message!"]),50)
  setTimeout(curry(g(),[null,{obj: 54}]),150)
}


exports.group2 = function (test){
  var g = ctrl.group()
  
  setTimeout(g(),100)
  setTimeout(g(),50)
  setTimeout(g(),150)
  
  g.done(function (err,results){
    it(err).equal(null)
    it(results).property('length',3)
    test.done()
  })
}

exports['group with error 2'] = function (test){
  var error = new Error("ERR")
    , g = ctrl.group()

  setTimeout(g(),100)
  f = g()
  setTimeout(function () {
    f(error)
  },50)
  setTimeout(g(),150)
  
  g.done(function (err,results){
    it(err).equal(error)
    it(results).property('length',3)
    test.done()
  })
}

exports['group with args'] = function (test){
  var error = new Error("ERR")
    , g = ctrl.group()
  
  setTimeout(curry(g(),[null,1,2,3]),100)
  setTimeout(curry(g(),[error,"message!"]),50)
  setTimeout(curry(g(),[null,{obj: 54}]),150)
  
  g.done(function (err,results){
    it(err).equal(error)
    it(results).property('length',3)
    it(results).has([
      [null,1,2,3]
    , [it.equal(error),"message!"]
    , [null,{obj: 54}]
    ])
    test.done()
  })
}

exports.group2 = function (test){
  var called = 0
  var g = ctrl.group({
    a: function (){
      called ++
      setTimeout(this.next,100)
    },
    b: function (){
      called ++
      setTimeout(this.next,50)
    },
    c: function (){
      called ++
      setTimeout(this.next,150)
    }
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
    a: [function (){
      called ++
      setTimeout(this.next,100)
    }],
    b: [function (){
      called ++
      setTimeout(this.next,50)
    }],
    c: [function (){
      called ++
      setTimeout(this.next,150)
    }]
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
        console.log('euhaoeuhaorcehuorcehruhc')
        setTimeout(this.next,100)
      }]
    }, function (err,results) {
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