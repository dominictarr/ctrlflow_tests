var ctrl = require('../ctrlflow')
  , it = require('it-is')
  
exports ['seq returns a function'] = function (test){

  var go = ctrl.seq([
   function (){ this.next() }])
  
  it(go).function()

  test.done() 
}

exports ['pass callback to seq function'] = function (test){

  var go = ctrl.seq([
   function (){ 
    this.next() 
   }])

  go(test.done)

}
exports ['pass error to callback of seq function'] = function (test){
  var err = new Error('example error')

  var go = ctrl.seq([
  function (){ 
    throw err
  }])

  go(function (_err) {
    it(_err).equal(err)
    test.done()
  })

}

exports ['pass [function, arg1, arg2, arg3,...] to set args'] = function (test) {
  var args = [1,0,2,2,4], called = 0
  var go = ctrl.seq([
  [function (){
      var _args = [].slice.call(arguments)
      called ++
      var cb = _args.pop()
      it(cb).function()
      it(args).deepEqual(_args)
      cb()
    },1,0,2,2,4]
  ])

  go(function (err) {
    if (err) throw err
    it(called).equal(1)
    test.done()
  })
}