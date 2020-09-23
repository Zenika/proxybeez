import * as http from "http";
import * as https from "https";

/**
 *
 * @param {string | URL} url
 */
export async function okJsonRequest(url) {
  const response = await okOrThrow(await request(url), url);
  if (!hasJsonBody(response)) {
    console.warn(
      `WARN: Parsing body as JSON but Content-Type is '${response.headers["content-type"]}'`
    );
  }
  const text = await parseBodyAsText(response);
  return JSON.parse(text);
}

/**
 *
 * @param {string | URL} url
 */
function request(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {}, (res) => {
      resolve(res);
    });
    req.on("error", reject);
    req.end();
  });
}

/**
 *
 * @param {http.IncomingMessage} response
 * @returns {Promise<http.IncomingMessage>}
 */
async function okOrThrow(response, url) {
  if (response.statusCode === 200) {
    return response;
  } else {
    throw await HttpClientError.of(url, response);
  }
}

/**
 *
 * @param {http.IncomingMessage} response
 * @returns {Promise<string>}
 */
async function parseBodyAsText(response) {
  let body = null;
  for await (const chunk of response) {
    body = (body || "") + chunk.toString();
  }
  return body;
}

/**
 *
 * @param {http.IncomingMessage} response
 * @returns {boolean}
 */
function hasJsonBody(response) {
  return (response.headers["content-type"] || "").includes("json");
}

export class HttpClientError extends Error {
  /**
   *
   * @param {http.IncomingMessage} response
   */
  static async of(url, response) {
    const responseBody = await parseBodyAsText(response);
    return new HttpClientError(url, {
      statusCode: response.statusCode,
      headers: response.headers,
      body: responseBody,
    });
  }

  /**
   *
   * @param {string | URL} url
   * @param {{ statusCode: number, headers: http.IncomingHttpHeaders, body: string }} response
   */
  constructor(url, response) {
    super("External HTTP service responded with error status code");
    this.url = url;
    this.response = response;
  }

  get statusCode() {
    return this.response.statusCode;
  }
}
