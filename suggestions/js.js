(function (global) {
  'use strict';

  // ECMAScript keywords, declarations, operators, and standard global names.
  const keywords = `as async await break case catch class const continue debugger default delete do else export extends false finally for from function get if import in instanceof let new null of return set static super switch this throw true try typeof var void while with yield`.split(/\s+/);
  const operators = `=== !== == != => ... ?. ?? ??= && || ** ++ -- += -= *= /= %= &&= ||= **= &= |= ^= <<= >>= >>>= + - * / % ** = < > <= >= ! ~ & | ^ << >> >>> ? : , ;`.split(/\s+/);
  const standardGlobals = `AggregateError Array ArrayBuffer Atomics BigInt BigInt64Array BigUint64Array Boolean DataView Date decodeURI decodeURIComponent encodeURI encodeURIComponent Error EvalError FinalizationRegistry Float16Array Float32Array Float64Array Function globalThis Infinity Int8Array Int16Array Int32Array Intl isFinite isNaN JSON Map Math NaN Number Object parseFloat parseInt Promise Proxy RangeError ReferenceError Reflect RegExp Set SharedArrayBuffer String Symbol SyntaxError TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array URIError WeakMap WeakRef WeakSet WebAssembly undefined`.split(/\s+/);
  const browserGlobals = `AbortController AbortSignal Animation Audio AudioContext Blob BroadcastChannel Cache CacheStorage CanvasRenderingContext2D Clipboard ClipboardItem CloseEvent CompressionStream CountQueuingStrategy Crypto CustomEvent DOMException DOMMatrix DOMParser DOMPoint DOMRect DOMTokenList Document Element Event EventSource EventTarget File FileList FileReader FormData Headers History Image ImageBitmap ImageData IntersectionObserver Intl MutationObserver Node NodeList Notification Performance PointerEvent ReadableStream ReadableStreamDefaultReader Request ResizeObserver Response Screen Storage TextDecoder TextEncoder TransformStream URL URLSearchParams WebSocket WheelEvent Window Worker WritableStream XMLSerializer`.split(/\s+/);
  const allGlobals = [...new Set([...keywords, ...standardGlobals, ...browserGlobals, ...operators])];

  function ownNames(value) {
    try { return Object.getOwnPropertyNames(value); } catch (_) { return []; }
  }

  function propertiesOf(value) {
    const names = new Set();
    for (let current = value, depth = 0; current && depth < 5; current = Object.getPrototypeOf(current), depth++) {
      ownNames(current).forEach(name => names.add(name));
    }
    return [...names];
  }

  function source(cm) {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line).slice(0, cursor.ch);
    let match = line.match(/(?:\?\.|\.)\s*([\w$]*)$/);
    if (match) {
      const query = match[1];
      const before = line.slice(0, match.index).replace(/\?\.$|\.$/, '').trimEnd();
      const path = before.match(/([\w$]+(?:\s*(?:\.\s*|\?\.\s*)[\w$]+)*)$/);
      let value = null;
      if (path) {
        const parts = path[1].split(/\s*(?:\.\s*|\?\.\s*)/).filter(Boolean);
        try {
          value = global;
          for (const part of parts) value = value == null ? null : value[part];
        } catch (_) { value = null; }
      }
      const names = value == null ? [] : propertiesOf(value);
      const items = names.filter(name => name.startsWith(query)).sort().map(name => ({ label: name, insert: name }));
      return { from: { line: cursor.line, ch: cursor.ch - query.length }, items };
    }

    match = line.match(/([\w$]*)$/);
    if (!match) return null;
    const query = match[1];
    const items = allGlobals.filter(name => name.startsWith(query)).map(name => ({ label: name, insert: name }));
    return { from: { line: cursor.line, ch: cursor.ch - query.length }, items };
  }

  global.EditorSuggestionSources = global.EditorSuggestionSources || {};
  global.EditorSuggestionSources.js = source;
})(window);
