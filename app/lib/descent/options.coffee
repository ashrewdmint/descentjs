module.exports = {
  targetGenome: {
    red: 255
    green: 0
    blue: 0
  }
  initialPop:       100
  maxPop:           1000
  difficulty:       0.5   # Mix relative and absolute fitness
  pDivideUnfit:     0
  pDivideFit:       1
  pDeathUnfit:      0.9
  pDeathFit:        0.2
  doomLine:         0.3   # Fitness point at which p_death and p_divide cross
  mutationHandicap: -0.5  # Divine blessing or judgement
  delay:            1     # Slow down time
}