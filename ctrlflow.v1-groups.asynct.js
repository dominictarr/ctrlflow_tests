var ctrl = require('../ctrlflow')
  , it = require('it-is')

exports ['seq returns a function'] = function (test){
  var called = 0
  var go = ctrl.seq([{
      a: function () {
        console.log('?')
        called ++
        this.next()
      }, 
      b: function () {
        called ++
        this.next()
      }, 
      c: function () {
        called ++
        this.next()
      }, 
    }, function(err, results) {
      it(results).has({
        a: [],
        b: [],
        c: []
      })
      called ++ 
    }])
    
  go(function (err) {
    if(err) throw err
    it(called).equal(4)
    test.done()
  })

}
