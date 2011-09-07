
var ctrl = require('ctrlflow')
  , it = require('it-is')
  , d = require('d-utils')
  , fs = require('fs')
  , path = require('path')

exports['simple serial'] = simple(ctrl.serial)
exports['simple parallel'] = simple(ctrl.parallel)

function simple(type) {
  return function (test) {
    //this map will map to the input through next tick
    var called = 0
    var mapper = 
      type.map(function (value, key, callback) {
        called ++
  //      /*d.delay*/(d.fallthrough)(value, callback) //  
        callback(null, value)
      }, true)

    it(mapper).function()

    mapper('abcdef'.split(''), function (err, results) {
      if(err) throw err
      it(results.join('')).equal('abcdef')
      test.done()
    })

  }
}
exports['ls parallel']  = ls(ctrl.parallel)
exports['ls serial']    = ls(ctrl.serial)
function ls (type) {
  return function (test) {
    var ls

    ctrl([
      fs.readdir
    , function (data, callback) {
        ls = data
        callback(null,data)
      }
    , type.map(fs.stat)
    ])
    (__dirname, function (err, data) {
      if(err) throw err
      it(data.length).equal(ls.length)
      test.done()
   })
  }
}

exports['ls-r parallel']  = lsR(ctrl.parallel)
exports['ls-r serial']    = lsR(ctrl.serial)
function lsR(type) {
  return function (test) {
    //fs has an arkward interface, because file are objects (state + behaviour) but fs is functions

    var ls = 
    ctrl([
      function (fn, cb) {
        console.log('dir:', fn)
        fs.stat(fn, function (err, stat) {
          if(err)
            cb(err)
          else {
            stat.name = fn
            cb(null, stat)
          }
        })
      }
    , function (file, next) {
        if(file.isDirectory())
          ctrl([
            [fs.readdir, file.name]
          , function (fn,next) {
              next(null, d.map(fn, function (v) {return path.join(file.name, v)}))
            }
          , type.map(ls)
          ])(next)
        else
          next(null, file)
      }
    ])

    ls(__dirname, function (err, data) {
      if(err)
        throw err 
      function print(file) {
        if(Array.isArray(file))
          d.each(file, function (f) {
            print(f)
          })
        else
          console.log(file.name)
      }
      print(data)
      test.done()
    })
  }
}