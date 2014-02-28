module.exports = _.object(
  _.map(['options', 'utility', 'random', 'genome', 'organism', 'world'], (name) ->
    [name, require 'lib/descent/' + name]
  )
)


# module.exports = {
#   utility:  require 'lib/descent/utility'
#   random:   require 'lib/descent/random'
#   genome:   require 'lib/descent/genome'
#   organism: require 'lib/descent/organism'
#   world:    require('lib/descent/world')(options)
# }
# 
# DIE_EXP    = 7   # How generous the mortality curve is
# MIN_AGE    = 4   # Most unfit individuals will die after this
# EXTRA_AGE  = 10  # The fittest live extra
# BABY_RATE  = 5   # 1/X
# PMUTATE    = 1/3
# MSCALE     = 100 # Amount of variation in one mutation
# MERCY      = 100 # Default is 100
# TARGET     = {red: 255, green: 0, blue: 0} # Evolve red things
# TIME       = 1