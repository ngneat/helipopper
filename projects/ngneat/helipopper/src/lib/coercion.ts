import { booleanAttribute as originalBooleanAttribute } from '@angular/core';

type BooleanInput = boolean | `${boolean}` | '' | null | undefined;

/**
 * Transforms a value (typically a string) to a boolean.
 * Intended to be used as a transform function of an input.
 *
 * @see https://material.angular.io/cdk/coercion/overview
 */
const coerceBooleanAttribute: (value: BooleanInput) => boolean = originalBooleanAttribute;

export { coerceBooleanAttribute };
