/**
 * This file is a one-off monkey patch to BigInt's prototype for toJSON.
 *
 * As defined, there is no way to serialize BigInt via JSON.stringify()[0] and this creates a nested set of problems because of how node and pg handle BigInt.
 * This patch is the solution.
 *
 * WARNING: Please make sure to import this at the top level of the project, ie app/layout.tsx, or otherwise any API route that returns a data payload with BigInt properties is liable to fail and/or misbehave.
 *
 * [0]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
 */

// @ts-expect-error: toJSON is a native implementation so TS is unhappy when we manipulate something it doesn't see.
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function() { return this.toString() };
