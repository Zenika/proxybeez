import * as querystring from "querystring";

/**
 *
 * @param {string} template
 * @param {URLSearchParams} searchParams
 * @returns {string}
 */
export default function renderPathTemplate(template, searchParams) {
  return template.replace(/\${(.*?)}/g, (_, $1) => {
    if (!searchParams.has($1)) {
      throw new RenderPathTemplateMissingValue($1);
    }
    return querystring.escape(searchParams.get($1) ?? "");
  });
}

export class RenderPathTemplateMissingValue extends Error {
  /**
   * @param {string} key
   */
  constructor(key) {
    super(`Cannot render template: missing value for key '${key}'`);
    this.key = key;
  }
}
