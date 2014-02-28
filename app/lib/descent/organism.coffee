Genome  = require 'lib/descent/genome'
Random  = require 'lib/descent/random'
Utility = require 'lib/descent/utility'

Organism = {
  default: ->
    genome: Genome.default(), age: 0, alive: true
  
  random: (minSize, maxSize) ->
    o = @default()
    o.genome = Genome.random(minSize, maxSize)
    o
  
  fitness: (o, options) ->
    # NOT VERY FUNCTIONAL OH NOES
    return o.fitness if o.fitness
    o.fitness = Genome.fitness(o.genome, options)

  linear: (a, b, percent) ->
    #min = Math.min(a, b)
    #max = Math.max(a, b)
    a + percent * (b - a)

  pDivide: (fitness, options) ->
    @linear options.pDivideUnfit, options.pDivideFit, fitness

  pDeath: (fitness, options) ->
    pDoom = @pDivide options.doomLine, options

    min = options.pDeathUnfit
    max = options.pDeathFit

    #if fitness > options.doomLine
    #  min = pDoom
    #else
    #  max = pDoom

    @linear min, max, fitness
  
  mortality: (fitness, age, options) ->
    exp = options.DIE_EXP * fitness
    max = options.MIN_AGE + (options.EXTRA_AGE * fitness)
    Math.pow(age / max, exp)    
  
  maybeDie: (mortality) ->
    Random.gamble mortality
  
  maybeReproduce: (fitness, mortality, options) ->
    fertility = 1 - mortality
    Random.gamble 1 / (options.BABY_RATE / (fitness * fertility))
  
  mutationCounter: (o, counter, options) ->
    counter ||= {good: 0, bad: 0}
    if o.parent && o.age == 0
      fo = @fitness(o, options)
      fp = @fitness(o.parent, options)
      counter.good += 1 if fo > fp
      counter.bad  += 1 if fo < fp
    counter
  
  copy: (o, args) -> # pmutate, scale, callback
    g = Genome.copy(
      genome:   o.genome
      pmutate:  args.pmutate
      scale:    args.scale
      callback: args.callback
    )
    o2 = @default()
    o2.genome = g
    o2.parent = o
    o2
  
  tick: (o, args) -> # counter, pmutate, scale, options
    args.counter ||= {births: 0, deaths: 0}
    counter   = @mutationCounter(o, args.counter, args.options)
    absFit    = @fitness(o, args.options)

    if args.siblings
      allFit = _.map(args.siblings, (o2) => @fitness(o2, args.options))
      maxFit = _.max allFit
      minFit = _.min allFit

      relFit = (absFit - minFit)/(maxFit - minFit)

      fitness = Utility.finite @linear relFit, absFit, args.options.difficulty
      fitness = 1 if absFit == 1
    else
      fitness = absFit

    mortality = @mortality(fitness, o.age, args.options)
    result    = {organisms: [o], counter: counter}
  
    # Are we dead?
    if Random.gamble @pDeath(fitness, args.options) # @maybeDie(mortality)
      counter.deaths += 1
      result.organisms = []
    # Are we multiplyin'
    else if Random.gamble @pDivide(fitness, args.options) # @maybeReproduce(fitness, mortality, args.options)
      counter.births += 2
      counter.population += 2
      result.organisms = [@copy(o, args), @copy(o, args)]
    # Are we idle?
    else
      o.age += 1
    
    result
}

module.exports = Organism