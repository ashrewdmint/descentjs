options = {
  DIE_EXP    : 7   # How generous the mortality curve is
  MIN_AGE    : 4   # Most unfit individuals will die after this
  EXTRA_AGE  : 10  # The fittest live extra
  BABY_RATE  : 5   # 1/X
  PMUTATE    : 1/3
  MSCALE     : 100 # Amount of variation in one mutation
  MERCY      : 100 # Default is 100
  TARGET     : {red: 255, green: 0, blue: 0} # Evolve red things
  TIME       : 1
  delay: 0
  maxPop: 500
  maxTime: 2000

  targetChangeRate: 0.1
  pMutateMin: 0.001
  difficulty: 0.8

  pDeathUnfit: 0.005
  pDeathFit: 0.001
  pDivideUnfit: 0.004
  pDivideFit: 0.01

  doomLine: 0.5


  callback: (world) ->
    $('#container').remove();
    container = $('<div id="container"></div>')
    $('body').append(container)

    history = $('#history')
    unless history.length
      history = $('<div id="history"></div>').css('overflow', 'hidden')
      $('body').prepend(history) unless $('#history').length

    container.css(
      overflow: 'hidden'
    )

    maxHeight = window.innerHeight * 0.60
    maxWidth  = window.innerWidth
    thingies  = world.organisms.length
    square    = Math.ceil Math.sqrt(thingies)

    w = maxWidth  / square
    h = maxHeight / square

    #rows = Math.round Math.log(thingies) / Math.log(2)
    #w = maxWidth / (thingies / rows)
    #h = maxHeight / rows

    averageColors = []

    for o in world.organisms
      colors = [o.genome.red, o.genome.green, o.genome.blue]
      averageColors.push colors

      div = $('<div></div>').css(
        backgroundColor: 'rgb(' + colors.join(', ') + ')'
        width: w
        height: h
        float: 'left'
      )
      container.append(div)

    averageColors = _.reduce(
      averageColors,
      (memo, value) ->
        _.map(memo, (x, i) -> value[i] + x)
      ,
      [0, 0, 0]
    )

    averageColors = _.map(averageColors, (color) -> Math.round(color/thingies))

    div2 = $('<div></div>').css(
      backgroundColor: 'rgb(' + averageColors.join(', ') + ')'
      height: 20
      float: 'left'
    )
    history.append div2

    children = history.children().length
    history.children().css('width', maxWidth / children)
}


# The application bootstrapper.
Application =
  initialize: ->
    HomeView = require 'views/home_view'
    Router = require 'lib/router'


    chart   = require 'lib/chart'
    Descent = require 'lib/descent/all'

    #chart()

    opts = Descent.utility.mergeOptions(options)

    w = Descent.world.setup Descent.world.default()
    w.finished = ->
      console.log(w.latest)
      console.log(w.organisms)

    Descent.world.delay w, opts

    # Ideally, initialized classes should be kept in controllers & mediator.
    # If you're making big webapp, here's more sophisticated skeleton
    # https://github.com/paulmillr/brunch-with-chaplin
    # @homeView = new HomeView()

    # Instantiate the router
    #@router = new Router()
    # Freeze the object
    # Object.freeze? this

module.exports = Application
