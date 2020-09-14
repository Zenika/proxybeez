import {
  parse as parseQuerystring,
  escape as escapeQuerystring,
} from "querystring";

export const parseAlibeezParamsFromQuery = (query) => {
  return Object.entries(parseQuerystring(query)).reduce(
    (previous, [key, value]) => ({
      ...previous,
      [key]: escapeQuerystring(value),
    }),
    {}
  );
};
