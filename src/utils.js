import {
  parse as parseQuerystring,
  escape as escapeQuerystring,
} from "querystring";


export const parseAlibeezParamsFromQuery = (query) => {
  const alibeezParams = parseQuerystring(query);
  alibeezParams.username = escapeQuerystring(alibeezParams.username);
  return alibeezParams;
};
