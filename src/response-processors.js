export function defaultFields(response, defaultValues) {
  const resultWithDefaults = response.result.map((result) => {
    return {
      ...defaultValues,
      ...result,
    };
  });
  return {
    ...response,
    result: resultWithDefaults,
  };
}
