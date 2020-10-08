/**
 *
 * @template {unknown} T
 * @param {T} initialInput
 * @param {(import("./config.js").RequestProcessorConfig | import("./config.js").ResponseProcessorConfig)[]} configs
 * @param {{ [id: string]: (t: T, config: any) => T}} library
 */
export default function runProcessors(initialInput, configs = [], library) {
  return configs.reduce((input, config) => {
    const [id, arg] = Object.entries(config)[0];
    return library[id](input, arg);
  }, initialInput);
}
