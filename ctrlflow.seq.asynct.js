var ctrl = require('../ctrlflow')
  , it = require('it-is').style('colour')
  
exports ['api'] = function (test){

  it(ctrl).has({
    seq: it.isFunction ()
  })
  it(ctrl.seq([])).isFunction ()

  test.done()
}
  
  var throwErr = 
  
exports ['turn sequence into a async function'] = function (test){

  var called = []
    , r = /uenthoaneuhoe/
    , args = [0,'oenuth', {}, r ]
    , go 



  go = //ctlr.seq returns a function
  ctrl.seq([
    function (){
      var _args = [].slice.call(arguments)
        , cb = _args.pop()
      it(_args).deepEqual(args)
      called.push(1)
      this.next(null, 0,'oenuth', {}, r)
    }
  ])

  it(go).isFunction ()
  
  //call the returned function with args & a callback.
  go(0,'oenuth', {}, r, function (err) {
    if(err) 
      throw err
    var _args = [].slice.call(arguments)
      , _err =_args.shift() 
    it(_args).deepEqual(args)

    it(called).deepEqual([1])
    test.done()
  })

}

exports ['callbacks only work once'] = function (test){

  var called = 0
    , go 

  go = //ctlr.seq returns a function
  ctrl.seq([
    function () {
      called ++
      console.log('IGNORE "OOPS" MESSAGE')
      this.next()
      this.next("ERROR") //aditional calls will be logged but ignored
    }
  ])

  //call the returned function with args & a callback.
  go(function (err) {
    it(called).equal(1)    
    test.done()
  })

}


exports ['pass args through sequence'] = function (test){

  var called = []

  ctrl.seq([
  function (x) {
    it(x).equal(0)
    
    called.push(1)
    this.next(null,1)
  },
  function (x) {
    it(x).equal(1)
    
    called.push(2)
    this.next(null,2)
  },
  function (x){
    it(x).equal(2)
    
    called.push(3)
    this.next(null,3)
  },
  function (x){
    it(x).equal(3)

    it(called).deepEqual([1,2,3])
    this.next()
  }])
  (0,function (err){
    if(err) 
      throw err
    test.done()
  })

}

exports ['catch throw in step'] = function (test){

  var called = []
    , error = new Error("INTENSIONAL ERROR")

  ctrl.seq([
    function (x) {
      throw error
    }])
  (function (err){
    //    console.log('******************************')
    it(err).equal(error)
    test.done()
  })
}

exports ['call a seq in parallel'] = function (test) {
  var called = 0
  var go = ctrl.seq([
    function (callback) {
      setTimeout(function () {
        callback(null, ++called)
        console.log(called)
        },1)
    }])


  ctrl([{
    A: go, B: go  
  }]) (function (err, data){
    if(err) throw err
    console.log(data)
    test.done()
  })

}

exports ['throw AND callback error'] = function (test) {
  var err1 = new Error('should see this error')
    , err2 = new Error('should not see this error')

  ctrl([function (callback) {
    process.nextTick(function () {
      callback(err2)
    })
    throw err1
  
  }])(function (err) {
    it(err).equal(err1)
    test.done()
  })

}