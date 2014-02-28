(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, options;

options = {
  DIE_EXP: 7,
  MIN_AGE: 4,
  EXTRA_AGE: 10,
  BABY_RATE: 5,
  PMUTATE: 1 / 3,
  MSCALE: 100,
  MERCY: 100,
  TARGET: {
    red: 255,
    green: 0,
    blue: 0
  },
  TIME: 1,
  delay: 0,
  maxPop: 1000,
  maxTime: 1000,
  pDeathFit: 0.26,
  difficulty: 40,
  callback: function(world) {
    var averageColors, children, colors, container, div, div2, h, history, maxHeight, maxWidth, o, square, thingies, w, _i, _len, _ref;
    $('#container').remove();
    container = $('<div id="container"></div>');
    $('body').append(container);
    history = $('#history');
    if (!history.length) {
      history = $('<div id="history"></div>').css('overflow', 'hidden');
      if (!$('#history').length) {
        $('body').prepend(history);
      }
    }
    container.css({
      overflow: 'hidden'
    });
    maxHeight = window.innerHeight * 1 / 3;
    maxWidth = window.innerWidth;
    thingies = world.organisms.length;
    square = Math.ceil(Math.sqrt(thingies));
    w = maxWidth / square;
    h = maxHeight / square;
    averageColors = [];
    _ref = world.organisms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      o = _ref[_i];
      colors = [o.genome.red, o.genome.green, o.genome.blue];
      averageColors.push(colors);
      div = $('<div></div>').css({
        backgroundColor: 'rgb(' + colors.join(', ') + ')',
        width: w,
        height: h,
        float: 'left'
      });
      container.append(div);
    }
    averageColors = _.reduce(averageColors, function(memo, value) {
      return _.map(memo, function(x, i) {
        return value[i] + x;
      });
    }, [0, 0, 0]);
    averageColors = _.map(averageColors, function(color) {
      return Math.round(color / thingies);
    });
    div2 = $('<div></div>').css({
      backgroundColor: 'rgb(' + averageColors.join(', ') + ')',
      height: 20,
      float: 'left'
    });
    history.append(div2);
    children = history.children().length;
    return history.children().css('width', maxWidth / children);
  }
};

Application = {
  initialize: function() {
    var Descent, HomeView, Router, chart, opts, w;
    HomeView = require('views/home_view');
    Router = require('lib/router');
    chart = require('lib/chart');
    Descent = require('lib/descent/all');
    opts = Descent.utility.mergeOptions(options);
    w = Descent.world.setup(Descent.world["default"]());
    w.finished = function() {
      return console.log(w.latest);
    };
    return Descent.world.delay(w, opts);
  }
};

module.exports = Application;

});

;require.register("initialize", function(exports, require, module) {
var application;

application = require('application');

$(function() {
  return application.initialize();
});

});

;require.register("lib/chart", function(exports, require, module) {

module.exports = function(data) {
  var cities, city, color, height, line, margin, svg, width, x, xAxis, y, yAxis;
  margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
  };
  width = window.innerWidth - 50 - margin.left - margin.right;
  height = window.innerHeight * 2 / 3 - 50 - margin.top - margin.bottom;
  x = d3.scale.linear().range([0, width]);
  y = d3.scale.linear().range([height, 0]);
  color = d3.scale.category10();
  xAxis = d3.svg.axis().scale(x).orient("bottom");
  yAxis = d3.svg.axis().scale(y).orient("left");
  line = d3.svg.line().interpolate("basis").x(function(d) {
    return x(d.date);
  }).y(function(d) {
    return y(d.temperature);
  });
  svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  data || (data = [
    {
      date: '20111001',
      "New York": 63.4,
      "San Francisco": 62.7,
      "Austin": 72.2
    }, {
      date: '20111002',
      "New York": 58.0,
      "San Francisco": 59.9,
      "Austin": 67.7
    }, {
      date: '20111003',
      "New York": 53.3,
      "San Francisco": 59.1,
      "Austin": 69.4
    }, {
      date: '20111004',
      "New York": 55.7,
      "San Francisco": 58.8,
      "Austin": 68.0
    }
  ]);
  color.domain(d3.keys(data[0]).filter(function(key) {
    return key !== "date";
  }));
  data.forEach(function(d, i) {
    d.date = i;
  });
  cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {
          date: d.date,
          temperature: +d[name]
        };
      })
    };
  });
  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));
  y.domain([
    d3.min(cities, function(c) {
      return d3.min(c.values, function(v) {
        return v.temperature;
      });
    }), d3.max(cities, function(c) {
      return d3.max(c.values, function(v) {
        return v.temperature;
      });
    })
  ]);
  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("");
  city = svg.selectAll(".city").data(cities).enter().append("g").attr("class", "city");
  city.append("path").attr("class", "line").attr("d", function(d) {
    return line(d.values);
  }).style("stroke", function(d) {
    return color(d.name);
  });
  return city.append("text").datum(function(d) {
    return {
      name: d.name,
      value: d.values[d.values.length - 1]
    };
  }).attr("transform", function(d) {
    return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
  }).attr("x", 3).attr("dy", ".35em").text(function(d) {
    return d.name;
  });
};

});

;require.register("lib/descent/all", function(exports, require, module) {

module.exports = _.object(_.map(['options', 'utility', 'random', 'genome', 'organism', 'world'], function(name) {
  return [name, require('lib/descent/' + name)];
}));

});

;require.register("lib/descent/genome", function(exports, require, module) {
var Genome, Random, Utility;

Random = require('lib/descent/random');

Utility = require('lib/descent/utility');

Genome = {
  "default": function() {
    return {
      red: 0,
      blue: 0,
      green: 0,
      size: 0,
      pmutate: 0.5,
      pscale: 50
    };
  },
  random: function(minSize, maxSize) {
    var g, name, _i, _len, _ref;
    g = this["default"]();
    g.size = Random.range(minSize, maxSize);
    g.pmutate = Math.random();
    g.pscale = Random.range(0, 255);
    _ref = ['red', 'blue', 'green'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      g[name] = Random.range(0, 255);
    }
    return g;
  },
  copy: function(args) {
    var copied, g, gene, value, _ref;
    g = this["default"]();
    _ref = args.genome;
    for (gene in _ref) {
      value = _ref[gene];
      copied = Math.max(this.mutate(value, args.genome.pmutate, args.genome.mscale), 0);
      if (gene !== 'size') {
        copied = Math.min(copied, 255);
      }
      if (copied !== value && typeof args.callback === 'function') {
        args.callback(gene, value, copied);
      }
      g[gene] = copied;
    }
    return g;
  },
  mutate: function(value, pmutate, scale) {
    var mutate;
    if (!Random.gamble(pmutate)) {
      return value;
    }
    mutate = value * Math.random();
    if (Random.gamble(0.5)) {
      mutate = -mutate;
    }
    return value + Math.round(Random.normal(scale));
  },
  fitness: function(g, options) {
    return this.fitnessEuclid(g, options);
  },
  fitnessEuclid: function(g, options) {
    var diffs, gene, max, value, _ref;
    max = 0;
    diffs = 0;
    _ref = options.targetGenome;
    for (gene in _ref) {
      value = _ref[gene];
      max += Math.pow(Math.max(value, 255 - value), 2);
      diffs += Math.pow(value - g[gene], 2);
    }
    return Utility.finite(1 - diffs / max);
  },
  fitnessPow: function(g, options) {
    var diff, fit, gene, max, value, _ref;
    fit = 1;
    max = 0;
    _ref = options.targetGenome;
    for (gene in _ref) {
      value = _ref[gene];
      diff = Math.abs(value - g[gene]);
      fit *= Math.pow(2, -diff);
    }
    return fit;
  },
  fitnessAbsLinear: function(g, options) {
    var diff, fit, gene, max, value, _ref;
    max = 0;
    diff = 0;
    _ref = options.targetGenome;
    for (gene in _ref) {
      value = _ref[gene];
      max += Math.max(value, 255 - value);
      diff += Math.abs(value, -g[gene]);
    }
    fit = 1 - diff / max;
    if (isFinite(fit)) {
      return fit;
    } else {
      return 0;
    }
  }
};

module.exports = Genome;

});

;require.register("lib/descent/options", function(exports, require, module) {

module.exports = {
  targetGenome: {
    red: 255,
    green: 0,
    blue: 0
  },
  initialPop: 100,
  maxPop: 1000,
  difficulty: 0.5,
  pDivideUnfit: 0,
  pDivideFit: 1,
  pDeathUnfit: 0.9,
  pDeathFit: 0.2,
  doomLine: 0.3,
  mutationHandicap: -0.5,
  delay: 1
};

});

;require.register("lib/descent/organism", function(exports, require, module) {
var Genome, Organism, Random, Utility;

Genome = require('lib/descent/genome');

Random = require('lib/descent/random');

Utility = require('lib/descent/utility');

Organism = {
  "default": function() {
    return {
      genome: Genome["default"](),
      age: 0,
      alive: true
    };
  },
  random: function(minSize, maxSize) {
    var o;
    o = this["default"]();
    o.genome = Genome.random(minSize, maxSize);
    return o;
  },
  fitness: function(o, options) {
    if (o.fitness) {
      return o.fitness;
    }
    return o.fitness = Genome.fitness(o.genome, options);
  },
  linear: function(a, b, percent) {
    return a + percent * (b - a);
  },
  pDivide: function(fitness, options) {
    return this.linear(options.pDivideUnfit, options.pDivideFit, fitness);
  },
  pDeath: function(fitness, options) {
    var max, min, pDoom;
    pDoom = this.pDivide(options.doomLine, options);
    min = options.pDeathUnfit;
    max = options.pDeathFit;
    return this.linear(min, max, fitness);
  },
  mortality: function(fitness, age, options) {
    var exp, max;
    exp = options.DIE_EXP * fitness;
    max = options.MIN_AGE + (options.EXTRA_AGE * fitness);
    return Math.pow(age / max, exp);
  },
  maybeDie: function(mortality) {
    return Random.gamble(mortality);
  },
  maybeReproduce: function(fitness, mortality, options) {
    var fertility;
    fertility = 1 - mortality;
    return Random.gamble(1 / (options.BABY_RATE / (fitness * fertility)));
  },
  mutationCounter: function(o, counter, options) {
    var fo, fp;
    counter || (counter = {
      good: 0,
      bad: 0
    });
    if (o.parent && o.age === 0) {
      fo = this.fitness(o, options);
      fp = this.fitness(o.parent, options);
      if (fo > fp) {
        counter.good += 1;
      }
      if (fo < fp) {
        counter.bad += 1;
      }
    }
    return counter;
  },
  copy: function(o, args) {
    var g, o2;
    g = Genome.copy({
      genome: o.genome,
      pmutate: args.pmutate,
      scale: args.scale,
      callback: args.callback
    });
    o2 = this["default"]();
    o2.genome = g;
    o2.parent = o;
    return o2;
  },
  tick: function(o, args) {
    var absFit, allFit, counter, fitness, maxFit, minFit, mortality, relFit, result,
      _this = this;
    args.counter || (args.counter = {
      births: 0,
      deaths: 0
    });
    counter = this.mutationCounter(o, args.counter, args.options);
    absFit = this.fitness(o, args.options);
    if (args.siblings) {
      allFit = _.map(args.siblings, function(o2) {
        return _this.fitness(o2, args.options);
      });
      maxFit = _.max(allFit);
      minFit = _.min(allFit);
      relFit = (absFit - minFit) / (maxFit - minFit);
      fitness = Utility.finite(this.linear(relFit, absFit, args.options.difficulty));
    } else {
      fitness = absFit;
    }
    mortality = this.mortality(fitness, o.age, args.options);
    result = {
      organisms: [o],
      counter: counter
    };
    if (Random.gamble(this.pDeath(fitness, args.options))) {
      counter.deaths += 1;
      result.organisms = [];
    } else if (Random.gamble(this.pDivide(fitness, args.options))) {
      counter.births += 2;
      counter.population += 2;
      result.organisms = [this.copy(o, args), this.copy(o, args)];
    } else {
      o.age += 1;
    }
    return result;
  }
};

module.exports = Organism;

});

;require.register("lib/descent/random", function(exports, require, module) {
var Random;

Random = {
  range: function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  },
  normal: function(scale) {
    if (scale == null) {
      scale = 1;
    }
    return this.box_muller()[0] * scale;
  },
  gamble: function(p) {
    return Math.random() <= p;
  },
  box_muller: function() {
    var c, rds, x, y;
    x = 0;
    y = 0;
    rds = 0;
    c = null;
    while (rds === 0 || rds > 1) {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      rds = x * x + y * y;
    }
    c = Math.sqrt(-2 * Math.log(rds) / rds);
    return [x * c, y * c];
  }
};

module.exports = Random;

});

;require.register("lib/descent/utility", function(exports, require, module) {
var Utility;

Utility = {
  mergeOptions: function(options) {
    var defaults;
    defaults = require('lib/descent/options');
    return _.extend(defaults, options || {});
  },
  average: function(array) {
    var sum;
    if (array.length === 0) {
      return 0;
    }
    sum = array.reduce(function(prev, current) {
      return prev + current;
    });
    return sum / array.length;
  },
  finite: function(n) {
    if (!isFinite(n)) {
      return 0;
    } else {
      return n;
    }
  },
  clone: function(obj) {
    var flags, key, newInstance;
    if (!(obj != null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = this.clone(obj[key]);
    }
    return newInstance;
  }
};

module.exports = Utility;

});

;require.register("lib/descent/world", function(exports, require, module) {
var MAX_MUTATE, MAX_VARIANCE, Organism, Utility, World, chart;

Utility = require('lib/descent/utility');

Organism = require('lib/descent/organism');

chart = require('lib/chart');

MAX_MUTATE = 1;

MAX_VARIANCE = 0;

World = {
  "default": function() {
    return {
      organisms: [],
      stats: [],
      initial: 100,
      limit: 100,
      age: 0
    };
  },
  setup: function(w) {
    var i, _i, _ref;
    w.latest = {
      population: w.initial,
      bad: 0,
      good: 0,
      deaths: 0,
      births: w.initial
    };
    for (i = _i = 1, _ref = w.initial; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
      w.organisms.push(Organism.random(1, 100));
    }
    return w;
  },
  simulate: function(w, options) {
    var fit, latest, o, result, survived, survivor, _i, _j, _len, _len1, _ref, _ref1;
    survived = [];
    fit = [];
    w.age += 1;
    if (w.latest.population === 0) {
      return w;
    }
    latest = Utility.clone(w.latest);
    _ref = w.organisms;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      o = _ref[_i];
      result = Organism.tick(o, {
        target: options.targetGenome,
        counter: latest,
        pmutate: options.PMUTATE,
        scale: options.MSCALE,
        options: options,
        siblings: w.organisms
      });
      _ref1 = result.organisms;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        survivor = _ref1[_j];
        survived.push(survivor);
        fit.push(Organism.fitness(survivor, options));
      }
      latest = result.counter;
    }
    survived = _.sortBy(survived, function(o) {
      return -Organism.fitness(o, options);
    }).slice(0, options.maxPop);
    w.organisms = survived;
    latest.population = w.organisms.length;
    latest.fitness = Utility.finite(Utility.average(fit));
    w.stats.push(latest);
    w.latest = latest;
    return w;
  },
  delay: function(w, options) {
    var _this = this;
    return w.timeout = setTimeout(function() {
      var max, preparedStats;
      _this.simulate(w, options);
      $('svg').remove();
      max = _.max(_.flatten(_.map(w.stats, function(s) {
        return _.values(_.omit(s, 'good', 'bad', 'births', 'deaths', 'fitness'));
      })));
      preparedStats = _.map(w.stats, function(stat, i) {
        var delta, deltaNames, s2, s3;
        deltaNames = ['good', 'bad', 'births', 'deaths'];
        delta = {};
        _.each(deltaNames, function(name) {
          return delta[name] = i === 0 ? stat[name] : stat[name] - w.stats[i - 1][name];
        });
        if (delta.good > MAX_MUTATE) {
          MAX_MUTATE = delta.good;
        }
        if (delta.bad > MAX_MUTATE) {
          MAX_MUTATE = delta.bad;
        }
        return s2 = _.extend({}, stat, {
          fitness: stat.fitness * max,
          good: (delta.good / MAX_MUTATE) * max / 2,
          bad: (delta.bad / MAX_MUTATE) * max / 2,
          births: delta.births,
          deaths: delta.deaths
        });
        s3 = _.object(_.map(s2, function(value, key) {
          return [key, value === 0 ? 0 : Math.log(value)];
        }));
        return s3;
      });
      if (w.age < options.maxTime && w.latest.population > 0 && w.latest.fitness < 1) {
        _this.delay(w, options);
      } else {
        if (typeof w.finished === 'function') {
          w.finished();
        }
      }
      chart(preparedStats);
      if (typeof options.callback === 'function') {
        return options.callback(w);
      }
    }, options.delay);
  }
};

module.exports = World;

});

;require.register("lib/router", function(exports, require, module) {
var Router, application,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = Router = (function(_super) {

  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.routes = {
    '': 'home'
  };

  Router.prototype.home = function() {
    return $('body').html(application.homeView.render().el);
  };

  return Router;

})(Backbone.Router);

});

;require.register("lib/view_helper", function(exports, require, module) {



});

;require.register("models/collection", function(exports, require, module) {
var Collection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Collection = (function(_super) {

  __extends(Collection, _super);

  function Collection() {
    return Collection.__super__.constructor.apply(this, arguments);
  }

  return Collection;

})(Backbone.Collection);

});

;require.register("models/model", function(exports, require, module) {
var Model,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {

  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  return Model;

})(Backbone.Model);

});

;require.register("views/home_view", function(exports, require, module) {
var HomeView, View, template,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('./view');

template = require('./templates/home');

module.exports = HomeView = (function(_super) {

  __extends(HomeView, _super);

  function HomeView() {
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = template;

  return HomeView;

})(View);

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"content\">\n  <h1>Test</h1>\n  <h2>Welcome!</h2>\n  <ul>\n    <li><a href=\"http://brunch.readthedocs.org/\">Documentation</a></li>\n    <li><a href=\"https://github.com/brunch/brunch/issues\">Github Issues</a></li>\n    <li><a href=\"https://github.com/brunch/twitter\">Twitter Example App</a></li>\n    <li><a href=\"https://github.com/brunch/todos\">Todos Example App</a></li>\n  </ul>\n</div>\n";});
});

;require.register("views/view", function(exports, require, module) {
var View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/view_helper');

module.exports = View = (function(_super) {

  __extends(View, _super);

  function View() {
    this.render = __bind(this.render, this);
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.template = function() {};

  View.prototype.getRenderData = function() {};

  View.prototype.render = function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  View.prototype.afterRender = function() {};

  return View;

})(Backbone.View);

});

;
//# sourceMappingURL=app.js.map