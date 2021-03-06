/**
 * Module dependencies.
 */

const http = require("http");
const Server = require("./server");

/**
 * Invoking the library as a function delegates to attach if the first argument
 * is an `http.Server`.
 *
 * If there are no arguments or the first argument is an options object, then
 * a new Server instance is returned.
 *
 * @param {http.Server} server (if specified, will be attached to by the new Server instance)
 * @param {Object} options
 * @return {Server} engine server
 * @api public
 */

exports = module.exports = function() {
  // backwards compatible use as `.attach`
  // if first argument is an http server
  if (arguments.length && arguments[0] instanceof http.Server) {
    return attach.apply(this, arguments);
  }

  // if first argument is not an http server, then just make a regular eio server
  return new Server(arguments);
};

/**
 * Protocol revision number.
 *
 * @api public
 */

exports.protocol = 1;

/**
 * Expose Server constructor.
 *
 * @api public
 */

exports.Server = Server;

/**
 * Expose Socket constructor.
 *
 * @api public
 */

exports.Socket = require("./socket");

/**
 * Expose Transport constructor.
 *
 * @api public
 */

exports.Transport = require("./transport");

/**
 * Expose mutable list of available transports.
 *
 * @api public
 */

exports.transports = require("./transports");

/**
 * Exports parser.
 *
 * @api public
 */

exports.parser = require("engine.io-parser");

/**
 * Creates an http.Server exclusively used for WS upgrades.
 *
 * @param {Number} port
 * @param {Function} callback
 * @param {Object} options
 * @return {Server} websocket.io server
 * @api public
 */

exports.listen = listen;

function listen(port, options, fn) {
  if ("function" === typeof options) {
    fn = options;
    options = {};
  }

  const server = http.createServer(function(req, res) {
    // 需要重新注册request事件，如果下面的代码被执行说明没有注册request事件
    res.writeHead(501);
    res.end("Not Implemented");
  });

  // create engine server
  const engine = exports.attach(server, options);
  engine.httpServer = server;

  server.listen(port, fn);

  return engine;
}

/**
 * Captures upgrade requests for a http.Server.
 *
 * @param {http.Server} server
 * @param {Object} options
 * @return {Server} engine server
 * @api public
 */

exports.attach = attach;

function attach(server, options) {
  const engine = new Server(options);
  engine.attach(server, options);
  return engine;
}
