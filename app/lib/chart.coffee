module.exports = (data) ->

  margin =
    top: 20
    right: 80
    bottom: 30
    left: 50

  width = window.innerWidth - 50 - margin.left - margin.right
  height = window.innerHeight * 2/3 - 50 - margin.top - margin.bottom
  #parseDate = d3.time.format("%Y%m%d").parse
  x = d3.scale.linear().range([
    0
    width
  ])
  y = d3.scale.linear().range([
    height
    0
  ])
  color = d3.scale.category10()
  xAxis = d3.svg.axis().scale(x).orient("bottom")
  yAxis = d3.svg.axis().scale(y).orient("left")
  line = d3.svg.line().interpolate("basis").x((d) ->
    x d.date
  ).y((d) ->
    y d.temperature
  )
  svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  # From TSV
  data ||= [
    { date: '20111001', "New York": 63.4, "San Francisco": 62.7, "Austin": 72.2 }
    { date: '20111002', "New York": 58.0, "San Francisco": 59.9, "Austin": 67.7 }
    { date: '20111003', "New York": 53.3, "San Francisco": 59.1, "Austin": 69.4 }
    { date: '20111004', "New York": 55.7, "San Francisco": 58.8, "Austin": 68.0 }
  ]

  color.domain d3.keys(data[0]).filter((key) ->
    key isnt "date"
  )
  data.forEach (d, i) ->
    #d.date = parseDate(d.date)
    d.date = i
    return

  cities = color.domain().map((name) ->
    name: name
    values: data.map((d) ->
      date: d.date
      temperature: +d[name]
    )
  )

  x.domain d3.extent(data, (d) ->
    d.date
  )
  y.domain [
    d3.min(cities, (c) ->
      d3.min c.values, (v) ->
        v.temperature

    )
    d3.max(cities, (c) ->
      d3.max c.values, (v) ->
        v.temperature

    )
  ]
  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call xAxis
  svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text ""
  city = svg.selectAll(".city").data(cities).enter().append("g").attr("class", "city")
  city.append("path").attr("class", "line").attr("d", (d) ->
    line d.values
  ).style "stroke", (d) ->
    color d.name

  city.append("text").datum((d) ->
    name: d.name
    value: d.values[d.values.length - 1]
  ).attr("transform", (d) ->
    "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"
  ).attr("x", 3).attr("dy", ".35em").text (d) ->
    d.name


##   defaults = {
##     margin: {
##       top:    20
##       right:  80
##       bottom: 30
##       left:   50
##     }
##     width: 800
##     height: 500
##   }
## 
##   
## 
##   options = _.extend defaults, options
## 
##   width  = options.width  - options.margin.left - options.margin.right
##   height = options.height - options.margin.top  - options.margin.bottom
## 
##   x = d3.time.scale()
##         .range([0, width])
## 
##   y = d3.time.scale.linear()
##         .range([height, 0])
## 
##   color = d3.scale.category10()
## 
##   xAxis = d3.svg.axis()
##             .scale(x)
##             .orient('bottom')
## 
##   yAxis = d3.svg.axis()
##             .scale(y)
##             .orient('left')
## 
##   line  = d3.svg.line()
##             .interpolate('basis')
##             .x( (data) -> data.time )
##             .y( (data) -> data.populationSize )
## 
##   d3.select('body').append('svg')
##       .attr('width',  options.width)
##       .attr('height', options.height)
##     .append('g')
##       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  #d3.tsv 'data.tsv', (error, data) ->
  #  color.domain d3.keys(data[0]).filter( (key) -> key !== 'date' )
#
  #  data.forEach (d) ->
  #    d.date = 'hello'
#
  #  cities = color.domain().map (name) ->
  #    {
  #      name: name
  #      values: data.map (d) -> {date: d.date, temperature: +d[name]}
  #    }
#
  #  x.domain d3.extent(data, (d) -> d.date)
  #  y.domain [
  #    d3.min cities, (c) -> d3.min(c.values, (v) -> v.temperature)
  #    d3.max cities, (c) -> d3.max(c.values, (v) -> v.temperature)
  #  ]
#
  #  svg.append("g")
  #      .attr("class", "x axis")
  #      .attr("transform", "translate(0," + height + ")")
  #      .call(xAxis);
  #  
  #  svg.append("g")
  #      .attr("class", "y axis")
  #      .call(yAxis)
  #    .append("text")
  #      .attr("transform", "rotate(-90)")
  #      .attr("y", 6)
  #      .attr("dy", ".71em")
  #      .style("text-anchor", "end")
  #      .text("Temperature (ºF)");
  #  
  #  city = svg.selectAll(".city")
  #      .data(cities)
  #    .enter().append("g")
  #      .attr("class", "city");
  #  
  #  city.append("path")
  #      .attr("class", "line")
  #      .attr("d", function(d) { return line(d.values); })
  #      .style("stroke", function(d) { return color(d.name); });
  #  
  #  city.append("text")
  #      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
  #      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
  #      .attr("x", 3)
  #      .attr("dy", ".35em")
  #      .text(function(d) { return d.name; });

# d3.tsv("data.tsv", function(error, data) {
#   color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
# 
#   data.forEach(function(d) {
#     d.date = parseDate(d.date);
#   });
# 
#   var cities = color.domain().map(function(name) {
#     return {
#       name: name,
#       values: data.map(function(d) {
#         return {date: d.date, temperature: +d[name]};
#       })
#     };
#   });
# 
#   x.domain(d3.extent(data, function(d) { return d.date; }));
# 
#   y.domain([
#     d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
#     d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
#   ]);
# 
#   svg.append("g")
#       .attr("class", "x axis")
#       .attr("transform", "translate(0," + height + ")")
#       .call(xAxis);
# 
#   svg.append("g")
#       .attr("class", "y axis")
#       .call(yAxis)
#     .append("text")
#       .attr("transform", "rotate(-90)")
#       .attr("y", 6)
#       .attr("dy", ".71em")
#       .style("text-anchor", "end")
#       .text("Temperature (ºF)");
# 
#   var city = svg.selectAll(".city")
#       .data(cities)
#     .enter().append("g")
#       .attr("class", "city");
# 
#   city.append("path")
#       .attr("class", "line")
#       .attr("d", function(d) { return line(d.values); })
#       .style("stroke", function(d) { return color(d.name); });
# 
#   city.append("text")
#       .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
#       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
#       .attr("x", 3)
#       .attr("dy", ".35em")
#       .text(function(d) { return d.name; });
# });
# 