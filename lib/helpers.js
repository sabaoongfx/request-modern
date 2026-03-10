'use strict'

const jsonSafeStringify = require('json-stringify-safe')
const crypto = require('crypto')
const { Buffer } = require('buffer')

const defer = typeof setImmediate === 'undefined'
  ? process.nextTick
  : setImmediate

function paramsHaveRequestBody (params) {
  return (
    params.body ||
    params.requestBodyStream ||
    (params.json && typeof params.json !== 'boolean') ||
    params.multipart
  )
}

function safeStringify (obj, replacer) {
  let ret
  try {
    ret = JSON.stringify(obj, replacer)
  } catch (e) {
    ret = jsonSafeStringify(obj, replacer)
  }
  return ret
}

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

function isReadStream (rs) {
  return rs.readable && rs.path && rs.mode
}

function toBase64 (str) {
  return Buffer.from(str || '', 'utf8').toString('base64')
}

function copy (obj) {
  const o = {}
  Object.keys(obj).forEach(function (i) {
    o[i] = obj[i]
  })
  return o
}

function version () {
  const numbers = process.version.replace('v', '').split('.')
  return {
    major: parseInt(numbers[0], 10),
    minor: parseInt(numbers[1], 10),
    patch: parseInt(numbers[2], 10)
  }
}

/**
 * Parse a URL string using the WHATWG URL API and add legacy url.parse() compat
 * properties (.path, .auth, .query) that the codebase relies on.
 */
function parseUrl (str) {
  const parsed = new URL(str)
  // .path = pathname + search (legacy url.parse compat)
  Object.defineProperty(parsed, 'path', {
    get () { return this.pathname + this.search },
    enumerable: true,
    configurable: true
  })
  // .auth = username:password (legacy url.parse compat, empty string if none)
  Object.defineProperty(parsed, 'auth', {
    get () {
      if (!this.username && !this.password) return null
      return decodeURIComponent(this.username) + (this.password ? ':' + decodeURIComponent(this.password) : '')
    },
    enumerable: true,
    configurable: true
  })
  // .query = search string without leading '?' (legacy url.parse compat)
  Object.defineProperty(parsed, 'query', {
    get () { return this.search ? this.search.slice(1) : null },
    enumerable: true,
    configurable: true
  })
  return parsed
}

exports.paramsHaveRequestBody = paramsHaveRequestBody
exports.safeStringify = safeStringify
exports.md5 = md5
exports.isReadStream = isReadStream
exports.toBase64 = toBase64
exports.copy = copy
exports.version = version
exports.defer = defer
exports.parseUrl = parseUrl
