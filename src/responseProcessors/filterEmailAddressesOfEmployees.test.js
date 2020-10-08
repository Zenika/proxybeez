import * as assert from "assert";
import { filterEmailAddressesOfEmployees } from "./filterEmailAddressesOfEmployees.js";

{
  const actual = filterEmailAddressesOfEmployees({ result: [{}, {}, {}] }, "");
  const expected = { result: [] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'filterEmailAddressesOfEmployees' does not reject results which do not have the field"
  );
}

{
  const actual = filterEmailAddressesOfEmployees(
    { result: [{ email: "" }] },
    "email"
  );
  const expected = { result: [] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'filterEmailAddressesOfEmployees' does not reject results for which the field is empty"
  );
}

{
  const actual = filterEmailAddressesOfEmployees(
    { result: [{ email: "@zenika.com" }] },
    "email"
  );
  const expected = { result: [] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'filterEmailAddressesOfEmployees' does not reject results for which the field only has the domain"
  );
}

{
  const actual = filterEmailAddressesOfEmployees(
    { result: [{ email: "z@example.com" }] },
    "email"
  );
  const expected = { result: [] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'filterEmailAddressesOfEmployees' does not reject results for which the field does not have the expected fomain"
  );
}

{
  const actual = filterEmailAddressesOfEmployees(
    { result: [{ email: "z@zenika.com" }] },
    "email"
  );
  const expected = { result: [{ email: "z@zenika.com" }] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'filterEmailAddressesOfEmployees' rejects results for which the field is a legitimate email"
  );
}

{
  const actual = filterEmailAddressesOfEmployees(
    { result: [{ email: "z-ext@zenika.com" }] },
    "email"
  );
  const expected = { result: [] };
  assert.deepStrictEqual(
    actual,
    expected,
    "'filterEmailAddressesOfEmployees' does not reject results for which the field is an email address of a contractor"
  );
}
