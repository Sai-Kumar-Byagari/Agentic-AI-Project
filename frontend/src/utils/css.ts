import type { CSSProperties } from 'react';

/**
 * Convert a plain CSS declaration string into a React style object.
 *
 * This lets us reproduce the exact style strings from the GIP Console
 * reference (`GIP Console v3.dc.html`) verbatim, so the implementation
 * stays a faithful 1:1 port of the design rather than a re-interpretation.
 *
 * Only top-level declarations are parsed: we split on ';' (no CSS value in
 * the reference contains a semicolon) and on the first ':' of each
 * declaration (values such as rgba()/linear-gradient()/font-family lists
 * contain no colons in the reference). Property names are camel-cased.
 */
export function css(style: string): CSSProperties {
  const out: Record<string, string> = {};
  if (!style) return out as CSSProperties;

  for (const decl of style.split(';')) {
    const trimmed = decl.trim();
    if (!trimmed) continue;

    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;

    const rawProp = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!rawProp || !value) continue;

    const prop = rawProp.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    out[prop] = value;
  }

  return out as CSSProperties;
}
