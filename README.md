# Proxybeez

Proxy to the Alibeez query API. Handles tenant multiplexing and per-client
access management.

# Why?

Alibeez already has an API, however it has two flaws that we needed fixed:

- It isn't possible to call multiple tenants in one request. Since one company
  can have multiple tenants, this is not convenient.
- Authentication is handled with static keys, managed by the Alibeez team,
  attributed to Alibeez users, and that have the same permissions as the user
  they're attributed to. There is no concept of keys for applications,
  fine-grained permissions, and there is no way for the customer to create,
  trace, and revoke keys.

Proxybeez fills those two requirements.

# How it works

Proxybeez works like a reverse-proxy. It has a configuration that defines how
requests should be routed, and it simply obeys that.

The configuration must be provided in JSON format through the `PROXYBEEZ_CONFIG`
environment variable or stored in a file pointed to by the
`PROXYBEEZ_CONFIG_FILE` environment variable. The schema of the expected JSON
value is described using TypeScript in `src/config.types.ts`. The value is
type-checked at startup.

The configuration is split in two sections : `alibeez` and `paths`. The first
section defines how Alibeez should be called for all requests. It includes the
definitions of tenants. The second section defines what paths (aka routes) are
available and to what Alibeez request they translate to.

## Alibeez section

Example of the simplest configuration, with one tenant and no processors:

```json
{
  "baseUrl": "https://example.my.alibeez.com/api",
  "tenants": {
    "exampleTenant": {}
  }
}
```

## Paths section

The following example shows how to define a path `/example_path` that will
delegate to the `/query/users` endpoint of Alibeez.

```json
{
  "/example_path": {
    "key": "example_key",
    "path": "/query/users?filter=username==${username}&fields=uuid,username"
  }
}
```

The value for `key` specifies the bearer token that the client must call with.
Values can be interpolated into `path`. These values are expected to be
specified using the query parameters of the incoming request. For this example,
calling `/example_path?username=example@example.com` would result in Proxybeez
calling `/query/users?filter=username==example@example.com&fields=uuid,username`
on Alibeez. Interpolated values are escaped for usage in query parameters.

## Processors

On either tenants on paths, the configuration can define a list of processors to
be called to transform the request or the response. The name of processors match
a function in the code, which is called with the matching part of the
configuration.

The following example shows how to call the `excludeFields` processors, which
exclude fields from the `fields` query parameter of an Alibeez request. The
matching function is defined in `src/requestProcessors/excludeFields.js`.

```json
{
  "processors": {
    "request": [{ "excludeFields": ["exampleField1", "exampleField2"] }]
  }
}
```

# How to setup for local development

- Install Node.js 14.11 or greater.
- `npm install`
- Copy `.env.example` to `.env`.
- Copy `config.example.json` to `config.json`.
- `npm run dev` to run Proxybeez with nodemon (the server restarts on code or
  config changes).

# Technical notes

## Modules

This projects uses ECMAScript modules exclusively.

## Tests

All tests may be run using `npm test`. One test file may be run using `node
file.test.js`.

Place tests for module `example.js` besides it in `example.test.js`. Ensure that
your test file is imported from `src/test.js`. Each test in a test file should
be enclosed in a block `{}`, use [Node's built-in assertion testing
functions](https://nodejs.org/dist/latest-v14.x/docs/api/assert.html), and have
a clear assertion failure message.

## Type-checking

Run `npm run typecheck` to type-check the project.

The code is type-checked with TypeScript (strict mode), but no running code
should be written TypeScript, to avoid the compilation step. Use JSDoc to type
your functions and variables (the full TypeScript syntax is accepted in JSDoc
types). Extract complex or common types to TypeScript files with the suffix
`.types.ts` (see `config.js` and `config.types.ts` for an example). There is no
need to import those files in other files.

> ℹ Due to limitations of TypeScript, types files cannot be named `example.ts`
> or `example.d.ts` if `example.js` also exists.

## Formatting

This project uses prettier. Check formatting with `npm run prettier:check` or
format the code with `npm run prettier:write`.
