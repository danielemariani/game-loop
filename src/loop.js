
var Loop = function (options) {
  this.lastFrameTime = 0;
  this.timeDelta = 0;
  this.FPS = 30;
  this.updatesPerSecond = 30;
  this.msForFPS = 1000 / this.FPS;
  this.timestep = 1000 / this.updatesPerSecond;

  this.speed = 1;
  this.isPaused = false;

  this.draw = options.draw;
  this.update = options.update;
};

Loop.prototype.timer = function(callback, resume) {
  var that = this;

  window.requestAnimationFrame(function(timestamp) {
    callback.call(that, timestamp, resume);
  });
};

Loop.prototype.isTimeForNextFrame = function(timestamp) {
  return (timestamp - this.lastFrameTime) > this.msForFPS;
};

Loop.prototype.hasToUpdate = function () {
  return this.timeDelta > this.timestep;
};

Loop.prototype.main = function(timestamp, resume) {

  if (resume) {
    this.lastFrameTime = timestamp;
  }

  if (!this.isTimeForNextFrame(timestamp)) {
    return this.next();
  }

  this.timeDelta += timestamp - this.lastFrameTime;
  this.lastFrameTime = timestamp;

  while (this.hasToUpdate()) {
    this.update(this.timestep * this.speed);
    this.timeDelta -= this.timestep;
  }

  this.draw();
  this.next();
};

Loop.prototype.start = function() {
  this.next();
};

Loop.prototype.next = function(resume) {
  if (!this.isPaused) {
    this.timer(this.main, resume);
  }
};

Loop.prototype.pause = function() {
  this.isPaused = true;
};

Loop.prototype.resume = function() {
  this.isPaused = false;
  this.next(true);
};

Loop.prototype.isPaused = function() {
  return this.isPaused;
};
