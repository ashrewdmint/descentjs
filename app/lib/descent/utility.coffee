Utility = {

  mergeOptions: (options) ->
    defaults = require 'lib/descent/options'
    _.extend defaults, options || {}

  average: (array) ->
    return 0 if array.length == 0
    sum = array.reduce((prev, current) ->
      prev + current
    )
    sum/array.length

  finite: (n) ->
    if !isFinite(n) then 0 else n
  
  clone: (obj) ->
    if not obj? or typeof obj isnt 'object'
      return obj

    if obj instanceof Date
      return new Date(obj.getTime()) 

    if obj instanceof RegExp
      flags = ''
      flags += 'g' if obj.global?
      flags += 'i' if obj.ignoreCase?
      flags += 'm' if obj.multiline?
      flags += 'y' if obj.sticky?
      return new RegExp(obj.source, flags) 

    newInstance = new obj.constructor()

    for key of obj
      newInstance[key] = @clone obj[key]
    
    return newInstance
}

module.exports = Utility