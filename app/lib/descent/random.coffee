Random = {
  range: (min, max) ->
    Math.round Math.random() * (max - min) + min
  
  normal: (scale = 1) ->
    @box_muller()[0] * scale
  
  gamble: (p) ->
    Math.random() <= p
  
  # http://jsperf.com/normal-random-number-generators
  box_muller: () ->
    x = 0
    y = 0
    rds = 0
    c   = null

    # Get two random numbers from -1 to 1.
    # If the radius is zero or greater than 1, throw them out and pick two new ones
    # Rejection sampling throws away about 20% of the pairs.
    while rds == 0 || rds > 1
      x = Math.random()*2-1
      y = Math.random()*2-1
      rds = x*x + y*y

    # This magic is the Box-Muller Transform
    c = Math.sqrt(-2*Math.log(rds)/rds)

    # It always creates a pair of numbers. I'll return them in an array. 
    # This function is quite efficient so don't be afraid to throw one away if you don't need both.
    return [x*c, y*c]
}

module.exports = Random