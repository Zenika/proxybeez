import * as http from "http";
import * as https from "https";

export async function okJsonRequest(url, options) {
  const response = await okOrThrow(await request(url, options));
  if (!hasJsonBody(response)) {
    console.warn(
      `WARN: Parsing body as JSON but Content-Type is '${response.headers["content-type"]}'`
    );
  }
  const text = await parseBodyAsText(response);
  return JSON.parse(text);
}

function request(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options || {}, (res) => {
      resolve(res);
    });
    req.on("error", reject);
    req.end();
  });
}

async function okOrThrow(response, requestOptions) {
  if (response.statusCode === 200) {
    return response;
  } else {
    throw await HttpClientError.of(requestOptions, response);
  }
}

async function parseBodyAsText(response) {
  let body = null;
  for await (const chunk of response) {
    body = (body || "") + chunk.toString();
  }
  return body;
}

export function hasJsonBody(response) {
  return (response.headers["content-type"] || "").includes("json");
}

export class HttpClientError extends Error {
  /**
   *
   * @param {https.RequestOptions} requestOptions
   * @param {http.IncomingMessage} response
   */
  static async of(requestOptions, response) {
    const responseBody = await parseBodyAsText(response);
    return new HttpClientError(requestOptions, {
      statusCode: response.statusCode,
      headers: response.headers,
      body: responseBody,
    });
  }

  /**
   *
   * @param {https.RequestOptions} requestOptions
   * @param {{ statusCode: number, headers: http.IncomingHttpHeaders, body: string }} response
   */
  constructor(requestOptions, response) {
    super("External HTTP service responded with error status code");
    this.requestOptions = requestOptions;
    this.response = response;
  }

  get statusCode() {
    return this.response.statusCode;
  }
}
