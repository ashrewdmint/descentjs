Utility  = require 'lib/descent/utility'
Organism = require 'lib/descent/organism'
chart    = require 'lib/chart'
Random   = require 'lib/descent/random'

MAX_MUTATE = 1
MAX_VARIANCE = 0

World = {
  default: ->
    {
      organisms: []
      stats:     []
      initial:   100
      limit:     100
      age:       0
    }
  
  setup: (w) ->
    w.latest = {
      population: w.initial
      bad: 0
      good: 0
      deaths: 0
      births: w.initial
    }

    for i in [1..(w.initial)]
      w.organisms.push Organism.random(1, 100)
    
    return w
  
  simulate: (w, options) ->
    survived = []
    fit      = []
    
    w.age  += 1
    return w if w.latest.population == 0
    
    latest = Utility.clone(w.latest)

    # Change genome over time
    #for gene, value of options.targetGenome
      #if Random.gamble options.targetChangeRate
        #value += Random.normal(255 * Math.random())
        #options.targetGenome[gene] = Math.min(Math.max(value, 0), 255)
    
    #console.log options.targetGenome

    for o in w.organisms
      result = Organism.tick(o, {
        target:  options.targetGenome
        counter: latest
        pmutate: options.PMUTATE
        scale:   options.MSCALE
        options: options
        siblings: w.organisms
      })
      
      for survivor in result.organisms
        survived.push(survivor)
        fit.push Organism.fitness(survivor, options)
      
      latest = result.counter

    survived = _.sortBy(survived, (o) -> -Organism.fitness(o, options) ).slice(0, options.maxPop)
   
    w.organisms = survived
    latest.population = w.organisms.length

    latest.fitness = Utility.finite Utility.average(fit)

    #latest.variance = Utility.average _.map(fit, (f) -> Math.exp(f - latest.fitness, 2))

    w.stats.push(latest)
    w.latest = latest
    return w
  
  delay: (w, options) ->
    w.timeout = setTimeout( =>
      @simulate w, options
      #console.log(w.age / w.limit)

      $('svg').remove()

      max = _.max(_.flatten(_.map(w.stats,
        (s) ->
          _.values _.omit(s, 'good', 'bad', 'births', 'deaths', 'fitness')
      )))
      #max = _.max(_.pluck(w.stats, 'population'))

      preparedStats = _.map w.stats, (stat, i) ->
        #max = stat.population

        deltaNames = ['good', 'bad', 'births', 'deaths']
        delta = {}

        _.each deltaNames, (name) ->
          delta[name] = if i == 0 then stat[name] else stat[name] - w.stats[i-1][name]

        MAX_MUTATE = delta.good if delta.good > MAX_MUTATE
        MAX_MUTATE = delta.bad  if delta.bad  > MAX_MUTATE
        # MAX_VARIANCE = stat.variance if stat.variance > MAX_VARIANCE

        return s2 = _.extend({}, stat,
          fitness: stat.fitness * max
          good: (delta.good/MAX_MUTATE) * max/2
          bad:  (delta.bad/MAX_MUTATE)  * max/2
          births: delta.births / 2
          deaths: delta.deaths
          # variance: (stat.variance/MAX_VARIANCE) * max/1.5
        )

        s3 = _.object _.map(s2, (value, key) ->
          [key, if value == 0 then 0 else Math.log(value)]
        )

        s3

      if w.age < options.maxTime && w.latest.population > 0 && w.latest.fitness < 1
        @delay w, options
      else
        w.finished() if typeof(w.finished) == 'function'

      chart preparedStats
      options.callback(w) if typeof(options.callback) == 'function'

    , options.delay)
}

module.exports = World