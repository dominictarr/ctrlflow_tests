var ctrl = require('../ctrlflow')
  , it = require('it-is')
  
exports ['api'] = function (test){

  it(ctrl).has({
    seq: it.function()
  })
  it(ctrl.seq()).has({
    go: it.function()
  , done: it.function()
  , throws: it.function()
  , onError: it.function()
  })

  test.done()
}
  var throwErr = function (err){
    if(!err)
      throw new Error('threw falsey error:' + err)
    throw err
  }
exports ['sequence'] = function (test){

  var called = []

  ctrl.seq([
  function (next){
    called.push(1)
    next()
  },
  function (next){
    called.push(2)
    next()
  },
  function (next){
    called.push(3)
    next()
  },
  function (){
    it(called).deepEqual([1,2,3])
    test.done()
  }],throwErr).go()
}

exports ['pass args through sequence, no error handling'] = function (test){

  var called = []

  ctrl.seq([
  function (x,next){
    it(x).equal(0)
    
    called.push(1)
    next(1)
  },
  function (x,next){
    it(x).equal(1)
    
    called.push(2)
    next(2)
  },
  function (x,next){
    it(x).equal(2)
    
    called.push(3)
    next(3)
  },
    function (x){
    it(x).equal(3)

    it(called).deepEqual([1,2,3])
    test.done()
  }])(0)

}

exports ['pass args through sequence, pass error to function'] = function (test){

  var called = []
    , error = new Error("INTENSIONAL ERROR")

  ctrl.seq([
  function (x,next){
    it(x).equal(0)
    
    called.push(1)
    next(null,1)
  },
  function (err,x,next){
    it(x).equal(1)
        
    throw error

    next(null,2)
  },
  function (err,x){
    it("this function").equal("should not be called")
  }],
  function onError (err){
 
    test.done()
  })(0)
}

exports ['set error handling to throw'] = function (test){

  var called = []
    , error = new Error("INTENSIONAL ERROR")

  test.catch = function (err){
    it(err).equal(error)
    test.done()
  }

  ctrl.seq([
  function (x){
    it(x).equal(0)
    
    called.push(1)
    this.next(null,1)
  },
  function (err,x){
    it(x).equal(1)
        
    throw error

    this.next(null,2)
  },
  function (err,x){
    it("this function").equal("should not be called")
  }]).throws()(0)
}
