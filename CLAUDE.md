# request-modern

Modernized, maintained fork of the deprecated `request` HTTP client library. Drop-in replacement with updated dependencies, zero known vulnerabilities, and Node.js 14+ support.

## Project Structure

- `index.js` — Entry point, exports the request function
- `request.js` — Core request implementation (~1200 lines)
- `lib/` — Modules: auth, cookies, har, hawk, helpers, multipart, oauth, querystring, redirect, tunnel, getProxyFromURI
- `tests/` — 54 test files using `tape`, run via `tape tests/test-*.js`
- `tests/ssl/` — SSL test certificates (2048-bit RSA keys)
- `tests/server.js` — Shared test server helper

## Commands

- `npm test` — Lint (standard) + run all tests
- `npm run test-ci` — Run tests only (no lint): `tape tests/test-*.js`
- `npm run lint` — Run StandardJS linter
- `npm run test-cov` — Run tests with nyc coverage

## Key Details

- **Package name**: `@sabaoongfx/request-modern`
- **Version**: 3.0.0
- **Linter**: StandardJS (no semicolons, 2-space indent)
- **Test framework**: tape
- **Node.js**: >= 14
- **License**: Apache-2.0
- `test-unix.js` is skipped on Windows (Unix domain sockets not supported)

## Code Style

- StandardJS: no semicolons, single quotes, 2-space indentation
- CommonJS modules (`require`/`module.exports`)
- Callback-style async patterns throughout
