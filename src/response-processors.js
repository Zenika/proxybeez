export function defaultFields(response, defaultValues) {
  return response.result.map((result) => {
    return {
      ...result,
      ...defaultValues,
    };
  });
}
