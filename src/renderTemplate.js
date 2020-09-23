/**
 *
 * @param {string} template
 * @param {object} vars
 * @returns {string}
 */
export default function renderTemplate(template, vars) {
  return template.replace(/\${(.*?)}/g, (_, $1) => {
    if ($1 in vars) {
      return vars[$1];
    } else {
      throw Object.assign(
        new Error(`Cannot render template: missing value for key '${$1}'`),
        { key: $1 }
      );
    }
  });
}
