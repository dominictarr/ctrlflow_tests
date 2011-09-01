var ctrl = require('../ctrlflow')
  , it = require('it-is')
  

var throwErr = function (err){
  if(!err)
    throw new Error('threw falsey error:' + err)
  throw err
}

exports ['pass args through sequence, no error handling'] = function (test){

  var called = []

  ctrl.seq([
  function (x,next){
    it(x).equal(0)
    
    called.push(1)
    next(null,1)
  },
  function (x,next){
    it(x).equal(1)
    
    called.push(2)
    next(null,2)
  },
  function (x,next){
    it(x).equal(2)
    
    called.push(3)
    next(null,3)
  }])(0, function (err,x){
    if(err) throw err
      it(x).equal(3)

    it(called).deepEqual([1,2,3])
    test.done()
  })

}