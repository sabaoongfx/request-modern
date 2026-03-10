'use strict'

const tape = require('tape')

if (process.platform === 'win32') {
  tape('unix sockets (skip on Windows)', function (t) {
    t.pass('skipped on Windows')
    t.end()
  })
} else {
  const request = require('../index')
  const http = require('http')
  const fs = require('fs')
  const rimraf = require('rimraf')
  const assert = require('assert')

  const rawPath = [null, 'raw', 'path'].join('/')
  const queryPath = [null, 'query', 'path'].join('/')
  const searchString = '?foo=bar'
  const socket = [__dirname, 'tmp-socket'].join('/')
  const expectedBody = 'connected'
  const statusCode = 200

  rimraf.sync(socket)

  const s = http.createServer(function (req, res) {
    const incomingUrl = new URL(req.url, 'http://localhost')
    switch (incomingUrl.pathname) {
      case rawPath:
        assert.equal(incomingUrl.pathname, rawPath, 'requested path is sent to server')
        break

      case queryPath:
        assert.equal(incomingUrl.pathname, queryPath, 'requested path is sent to server')
        assert.equal(incomingUrl.search, searchString, 'query string is sent to server')
        break

      default:
        assert(false, 'A valid path was requested')
    }
    res.statusCode = statusCode
    res.end(expectedBody)
  })

  tape('setup', function (t) {
    s.listen(socket, function () {
      t.end()
    })
  })

  tape('unix socket connection', function (t) {
    request('http://unix:' + socket + ':' + rawPath, function (err, res, body) {
      t.equal(err, null, 'no error in connection')
      t.equal(res.statusCode, statusCode, 'got HTTP 200 OK response')
      t.equal(body, expectedBody, 'expected response body is received')
      t.end()
    })
  })

  tape('unix socket connection with qs', function (t) {
    request({
      uri: 'http://unix:' + socket + ':' + queryPath,
      qs: {
        foo: 'bar'
      }
    }, function (err, res, body) {
      t.equal(err, null, 'no error in connection')
      t.equal(res.statusCode, statusCode, 'got HTTP 200 OK response')
      t.equal(body, expectedBody, 'expected response body is received')
      t.end()
    })
  })

  tape('cleanup', function (t) {
    s.close(function () {
      fs.unlink(socket, function () {
        t.end()
      })
    })
  })
}
