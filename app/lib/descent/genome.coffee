Random = require 'lib/descent/random'
Utility = require 'lib/descent/utility'

Genome = {
  default: ->
    red: 0, blue: 0, green: 0, size: 0, pmutate: 0.5, pscale: 50
  
  random: (minSize, maxSize) ->
    g = @default()
    g.size = Random.range(minSize, maxSize)
    g.pmutate = Math.random()
    g.pscale  = Random.range(0, 255)
    
    for name in ['red', 'blue', 'green']
      g[name] = Random.range(0, 255)
    
    g
  
  copy: (args) -> # genome, pmutate, scale, callback
    g = @default()
    for gene, value of args.genome
      copied = Math.max(@mutate(value, args.genome.pmutate, args.genome.mscale), 0)
      copied = Math.min(copied, 255) unless gene == 'size'
      if copied != value and typeof(args.callback) == 'function'
        args.callback(gene, value, copied)
      
      g[gene] = copied
    g
  
  mutate: (value, pmutate, scale) ->
    return value unless Random.gamble(pmutate)

    mutate = value * Math.random()
    mutate = -mutate if Random.gamble 0.5
    #value + mutate

    value + Math.round(Random.normal(scale))

  fitness: (g, options) ->
    @fitnessEuclid g, options

  fitnessEuclid: (g, options) ->
    max   = 0
    diffs = 0

    for gene, value of options.targetGenome
      max   += Math.pow(Math.max(value, 255 - value), 2)
      diffs += Math.pow(value - g[gene], 2)

    Utility.finite 1 - diffs / max

  
  fitnessPow: (g, options) ->
    fit = 1
    max = 0
    for gene, value of options.targetGenome
      diff = Math.abs(value - g[gene])
      fit *= Math.pow(2, -diff)
    fit

  fitnessAbsLinear: (g, options) ->
    max  = 0
    diff = 0
    for gene, value of options.targetGenome
      max  += Math.max(value, 255 - value)
      diff += Math.abs(value, - g[gene])
    
    fit = 1 - diff / max
    if isFinite(fit) then fit else 0


}

module.exports = Genome

      #diff = Math.abs(value - g[gene])
      #fit *= Math.pow(2, -diff/options.MERCY)
    #Math.round(fit * places)/places