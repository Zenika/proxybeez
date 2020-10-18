type AlibeezRequester = (
  processorsConfig: ProcessorsConfig
) => Promise<AlibeezResponse>;

type AlibeezResponse = { result?: { [key: string]: unknown }[] };
