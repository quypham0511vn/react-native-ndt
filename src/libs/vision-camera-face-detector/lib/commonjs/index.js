"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scanFaces = scanFaces;

/**
 * Scans QR codes.
 */
function scanFaces(frame) {
  'worklet'; // @ts-ignore
  // eslint-disable-next-line no-undef

  return __scanFaces(frame);
}
//# sourceMappingURL=index.js.map