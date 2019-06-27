import _ from "lodash";
import Widgets from "./Widgets";
import * as Ajv from "ajv";

const widgetMap = {
  boolean: {
    checkbox: "CheckboxWidget",
    radio: "RadioWidget",
    select: "UnsupportedWidget", //"SelectWidget"
    hidden: "UnsupportedWidget", //"HiddenWidget"
    text: "CheckboxWidget"
  },
  string: {
    text: "TextWidget",
    password: "UnsupportedWidget",
    email: "UnsupportedWidget",
    hostname: "TextWidget",
    ipv4: "TextWidget",
    ipv6: "TextWidget",
    uri: "UnsupportedWidget",
    "data-url": "UnsupportedWidget",
    radio: "RadioWidget",
    select: "DropDownWidget",
    textarea: "UnsupportedWidget",
    hidden: "UnsupportedWidget",
    date: "DateWidget",
    datetime: "UnsupportedWidget",
    "date-time": "UnsupportedWidget",
    "alt-date": "UnsupportedWidget",
    "alt-datetime": "UnsupportedWidget",
    color: "UnsupportedWidget",
    file: "UnsupportedWidget"
  },
  number: {
    text: "TextWidget",
    select: "UnsupportedWidget",
    updown: "UnsupportedWidget",
    range: "UnsupportedWidget",
    radio: "RadioWidget",
    hidden: "UnsupportedWidget"
  },
  integer: {
    text: "TextWidget",
    select: "DropDownWidget",
    updown: "UnsupportedWidget",
    range: "SliderWidget",
    radio: "RadioWidget",
    hidden: "UnsupportedWidget",
    checkboxes: "CheckboxesWidget"
  },
  array: {
    select: "UnsupportedWidget",
    checkboxes: "CheckboxesWidget",
    files: "UnsupportedWidget"
  }
};
/**
 * Method gives the widget and their type according to the widget list in the form
 * @param  {object} schema
 * @param  {object} widget
 * @param  {object} registeredWidgets={}
 */
export function getWidget(schema, widget, registeredWidgets = {}) {
  const type = getSchemaType(schema);
  /**
   * Merge the widget
   * @param  {object} Widget
   * @returns {object} widget
   */
  function mergeOptions(Widget) {
    // cache return value as property of widget for proper react reconciliation
    return Widget;
    if (!Widget.MergedWidget) {
      const defaultOptions =
        (Widget.defaultProps && Widget.defaultProps.options) || {};
      Widget.MergedWidget = ({ options = {}, ...props }) => (
        <Widget options={{ ...defaultOptions, ...options }} {...props} />
      );
    }
    return Widget.MergedWidget;
  }
  /** Check the widget type as function
   * @returns {object} widget
   */
  if (typeof widget === "function") {
    return mergeOptions(widget);
  }

  if (typeof widget !== "string") {
    throw new Error(`Unsupported widget definition: ${typeof widget}`);
  }

  if (registeredWidgets.hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widget];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  if (!widgetMap.hasOwnProperty(type)) {
    throw new Error(`No widget for type "${type}"`);
  }

  if (widgetMap[type].hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widgetMap[type][widget]];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  throw new Error(`No widget "${widget}" for type "${type}"`);
}
/**
 * Method gives the default registry
 *  @returns {object} widget
 */
export function getDefaultRegistry() {
  return Widgets;
}
/**
 * @param  {object} uiOrder
 * @returns {string} text
 */
export function getWidgetType(uiOrder) {
  if ("ui:widget" in uiOrder) return uiOrder["ui:widget"];
  return "text";
}

function withDependentProperties(schema, additionallyRequired) {
  if (!additionallyRequired) {
    return schema;
  }
  const required = Array.isArray(schema.required)
    ? Array.from(new Set([...schema.required, ...additionallyRequired]))
    : additionallyRequired;
  return { ...schema, required: required };
}

export function isObject(thing) {
  return typeof thing === "object" && thing !== null && !Array.isArray(thing);
}

export function isMultiSelect(schema, definitions = {}) {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(schema.items, definitions);
}

export function isFixedItems(schema) {
  return (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every(item => isObject(item))
  );
}

export function mergeObjects(obj1, obj2, concatArrays = false) {
  // Recursively merge deeply nested objects.
  var acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1[key],
      right = obj2[key];
    if (obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}


function computeDefaults(schema, parentDefaults, definitions = {}) {
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults = parentDefaults;
  if (isObject(defaults) && isObject(schema.default)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeObjects(defaults, schema.default);
  } else if ("default" in schema) {
    // Use schema defaults for this node.
    defaults = schema.default;
  } else if ("$ref" in schema) {
    // Use referenced schema defaults for this node.
    const refSchema = findSchemaDefinition(schema.$ref, definitions);
    return computeDefaults(refSchema, defaults, definitions);
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map(itemSchema =>
      computeDefaults(itemSchema, undefined, definitions)
    );
  }
  // Not defaults defined for this node, fallback to generic typed ones.
  if (typeof defaults === "undefined") {
    defaults = schema.default;
  }

  switch (schema.type) {
    // We need to recur for object schema inner default values.
    case "object":
      return Object.keys(schema.properties || {}).reduce((acc, key) => {
        // Compute the defaults for this node, with the parent defaults we might
        // have from a previous run: defaults[key].
        acc[key] = computeDefaults(
          schema.properties[key],
          (defaults || {})[key],
          definitions
        );
        return acc;
      }, {});

    case "array":
      if (schema.minItems) {
        if (!isMultiSelect(schema, definitions)) {
          const defaultsLength = defaults ? defaults.length : 0;
          if (schema.minItems > defaultsLength) {
            const defaultEntries = defaults || [];
            // populate the array with the defaults
            const fillerEntries = fill(
              new Array(schema.minItems - defaultsLength),
              computeDefaults(schema.items, schema.items.defaults, definitions)
            );
            // then fill up the rest with either the item default or empty, up to minItems

            return defaultEntries.concat(fillerEntries);
          }
        } else {
          return [];
        }
      }
  }
  return defaults;
}

export function getDefaultFormState(_schema, formData, definitions = {}) {
  if (!isObject(_schema)) {
    throw new Error("Invalid schema: " + _schema);
  }
  const schema = retrieveSchema(_schema, definitions, formData);
  const defaults = computeDefaults(schema, _schema.default, definitions);
  if (typeof formData === "undefined") {
    // No form data? Use schema defaults.
    return defaults;
  }
  if (isObject(formData)) {
    // Override schema defaults with form data.
    return mergeObjects(defaults, formData);
  }
  return formData || defaults;
}

function withDependentSchema(
  schema,
  definitions,
  formData,
  dependencyKey,
  dependencyValue
) {
  let { oneOf, ...dependentSchema } = retrieveSchema(
    dependencyValue,
    definitions,
    formData
  );
  schema = mergeSchemas(schema, dependentSchema);
  // Since it does not contain oneOf, we return the original schema.
  if (oneOf === undefined) {
    return schema;
  } else if (!Array.isArray(oneOf)) {
    throw new Error(`invalid: it is some ${typeof oneOf} instead of an array`);
  }
  // Resolve $refs inside oneOf.
  const resolvedOneOf = oneOf.map(subschema =>
    subschema.hasOwnProperty("$ref")
      ? resolveReference(subschema, definitions, formData)
      : subschema
  );
  return withExactlyOneSubschema(
    schema,
    definitions,
    formData,
    dependencyKey,
    resolvedOneOf
  );
}

function withExactlyOneSubschema(
  schema,
  definitions,
  formData,
  dependencyKey,
  oneOf
) {
  const validSubschemas = oneOf.filter(subschema => {
    if (!subschema.properties) {
      return false;
    }
    const { [dependencyKey]: conditionPropertySchema } = subschema.properties;
    if (conditionPropertySchema) {
      const conditionSchema = {
        type: "object",
        properties: {
          [dependencyKey]: conditionPropertySchema,
        },
      };
      const { errors } = validateFormData(formData, conditionSchema);
      return errors.length === 0;
    }
  });
  if (validSubschemas.length !== 1) {
    console.warn(
      "ignoring oneOf in dependencies because there isn't exactly one subschema that is valid"
    );
    return schema;
  }
  const subschema = validSubschemas[0];
  const {
    [dependencyKey]: conditionPropertySchema,
    ...dependentSubschema
  } = subschema.properties;
  const dependentSchema = { ...subschema, properties: dependentSubschema };
  return mergeSchemas(
    schema,
    retrieveSchema(dependentSchema, definitions, formData)
  );
}

function mergeSchemas(schema1, schema2) {
  return mergeObjects(schema1, schema2, true);
}

function isArguments(object) {
  return Object.prototype.toString.call(object) === "[object Arguments]";
}

export function deepEquals(a, b, ca = [], cb = []) {
  // Partially extracted from node-deeper and adapted to exclude comparison
  // checks for functions.
  // https://github.com/othiym23/node-deeper
  if (a === b) {
    return true;
  } else if (typeof a === "function" || typeof b === "function") {
    // Assume all functions are equivalent
    // see https://github.com/mozilla-services/react-jsonschema-form/issues/255
    return true;
  } else if (typeof a !== "object" || typeof b !== "object") {
    return false;
  } else if (a === null || b === null) {
    return false;
  } else if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (a instanceof RegExp && b instanceof RegExp) {
    return (
      a.source === b.source &&
      a.global === b.global &&
      a.multiline === b.multiline &&
      a.lastIndex === b.lastIndex &&
      a.ignoreCase === b.ignoreCase
    );
  } else if (isArguments(a) || isArguments(b)) {
    if (!(isArguments(a) && isArguments(b))) {
      return false;
    }
    let slice = Array.prototype.slice;
    return deepEquals(slice.call(a), slice.call(b), ca, cb);
  } else {
    if (a.constructor !== b.constructor) {
      return false;
    }

    let ka = Object.keys(a);
    let kb = Object.keys(b);
    // don't bother with stack acrobatics if there's nothing there
    if (ka.length === 0 && kb.length === 0) {
      return true;
    }
    if (ka.length !== kb.length) {
      return false;
    }

    let cal = ca.length;
    while (cal--) {
      if (ca[cal] === a) {
        return cb[cal] === b;
      }
    }
    ca.push(a);
    cb.push(b);

    ka.sort();
    kb.sort();
    for (var j = ka.length - 1; j >= 0; j--) {
      if (ka[j] !== kb[j]) {
        return false;
      }
    }

    let key;
    for (let k = ka.length - 1; k >= 0; k--) {
      key = ka[k];
      if (!deepEquals(a[key], b[key], ca, cb)) {
        return false;
      }
    }

    ca.pop();
    cb.pop();

    return true;
  }
}

// export function shouldRender(comp, nextProps, nextState) {
//   const { props, state } = comp;
//   return !deepEquals(props, nextProps) || !deepEquals(state, nextState);
// }

// This function will create new "properties" items for each key in our formData
export function stubExistingAdditionalProperties(
  schema,
  definitions = {},
  formData = {}
) {
  // Clone the schema so we don't ruin the consumer's original
  schema = {
    ...schema,
    properties: { ...schema.properties },
  };
  Object.keys(formData).forEach(key => {
    if (schema.properties.hasOwnProperty(key)) {
      // No need to stub, our schema already has the property
      return;
    }
    const additionalProperties = schema.additionalProperties.hasOwnProperty(
      "type"
    )
      ? { ...schema.additionalProperties }
      : { type: guessType(formData[key]) };
    // The type of our new key should match the additionalProperties value;
    schema.properties[key] = additionalProperties;
    // Set our additional property flag so we know it was dynamically added
    schema.properties[key][ADDITIONAL_PROPERTY_FLAG] = true;
  });

  return schema;
}

function findSchemaDefinition($ref, definitions = {}) {
  // Extract and use the referenced definition if we have it.
  const match = /^#\/definitions\/(.*)$/.exec($ref);
  if (match && match[1]) {
    const parts = match[1].split("/");
    let current = definitions;
    for (let part of parts) {
      part = part.replace(/~1/g, "/").replace(/~0/g, "~");
      if (current.hasOwnProperty(part)) {
        current = current[part];
      } else {
        // No matching definition found, that's an error (bogus schema?)
        throw new Error(`Could not find a definition for ${$ref}.`);
      }
    }
    return current;
  }
}


function resolveReference(schema, definitions, formData) {
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref, definitions);
  // Drop the $ref property of the source schema.
  const { $ref, ...localSchema } = schema;
  // Update referenced schema definition with local schema properties.
  return retrieveSchema(
    { ...$refSchema, ...localSchema },
    definitions,
    formData
  );
}

export function resolveSchema(schema, definitions = {}, formData = {}) {
  if (schema.hasOwnProperty("$ref")) {
    return resolveReference(schema, definitions, formData);
  } else if (schema.hasOwnProperty("dependencies")) {
    const resolvedSchema = resolveDependencies(schema, definitions, formData);
    return retrieveSchema(resolvedSchema, definitions, formData);
  } else {
    // No $ref or dependencies attribute found, returning the original schema.
    return schema;
  }
}

export function retrieveSchema(schema, definitions = {}, formData = {}) {
  const resolvedSchema = resolveSchema(schema, definitions, formData);
  const hasAdditionalProperties =
    resolvedSchema.hasOwnProperty("additionalProperties") &&
    resolvedSchema.additionalProperties !== false;
  if (hasAdditionalProperties) {
    return stubExistingAdditionalProperties(
      resolvedSchema,
      definitions,
      formData
    );
  }
  return resolvedSchema;
}

export function toIdSchema(
  schema,
  id,
  definitions,
  formData = {},
  idPrefix = "root"
) {
  const idSchema = {
    $id: id || idPrefix,
  };
  if ("$ref" in schema || "dependencies" in schema) {
    const _schema = retrieveSchema(schema, definitions, formData);
    return toIdSchema(_schema, id, definitions, formData, idPrefix);
  }
  if ("items" in schema && !schema.items.$ref) {
    return toIdSchema(schema.items, id, definitions, formData, idPrefix);
  }
  if (schema.type !== "object") {
    return idSchema;
  }
  for (const name in schema.properties || {}) {
    const field = schema.properties[name];
    const fieldId = idSchema.$id + "_" + name;
    idSchema[name] = toIdSchema(
      field,
      fieldId,
      definitions,
      formData[name],
      idPrefix
    );
  }
  return idSchema;
}
/**
 * Method executes the iteator of the given array
 * @param  {array} temp
 */
export function optionsArray(array = []) {
  let temp = [];

  array.forEach(item => {
    temp.push({ label: item.title, value: item.enum });
  });
  return temp;
}
/**
 * Method create the mew array
 * @param  {array}
 * @param  {array} value
 * @returns {array} newArr
 */
export function updateArray(arr = [], value) {
  let newArr = [];
  if (_.includes(arr, value)) {
    newArr = _.pull(arr, value);
  } else {
    newArr = [...arr, value];
  }

  return newArr;
}

export function shouldRender(nextProps, currentProps) {
  return !_.isEqual(nextProps, currentProps);
}
/**
 * Method gives the schema type as stirng
 * @param  {object} schema
 * @returns {string} type
 */
export function getSchemaType(schema) {
  let { type } = schema;
  if (!type && schema.enum) {
    type = "string";
  }
  return type;
}
/**
 * Method gives the keyboard type
 * @param  {string} type
 * @returns default
 */
export function getKeyboardType(type) {
  if (type === "number" || type === "integer") {
    return "decimal-pad";
  }

  return "default";
}
/**
 * Method gives the required array
 * @param  {object} schema
 * @param  {object} idSchema
 */
export function isRequired(schema, idSchema) {
  return (
    Array.isArray(schema.required) && schema.required.indexOf(idSchema) !== -1
  );
}
/**
 * Method gives the error schema
 * @param  {object} errors
 * @returns {object} errorschema
 */
export function toErrorSchema(errors) {
  // Transforms a ajv validation errors list:
  // [
  //   {property: ".level1.level2[2].level3", message: "err a"},
  //   {property: ".level1.level2[2].level3", message: "err b"},
  //   {property: ".level1.level2[4].level3", message: "err b"},
  // ]
  // Into an error tree:
  // {
  //   level1: {
  //     level2: {
  //       2: {level3: {errors: ["err a", "err b"]}},
  //       4: {level3: {errors: ["err b"]}},
  //     }
  //   }
  // };
  if (!errors.length) {
    return {};
  }
  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = _.toPath(property);
    let parent = errorSchema;

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === "") {
      path.splice(0, 1);
    }

    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        parent[segment] = {};
      }
      parent = parent[segment];
    }
    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message);
    } else {
      parent.__errors = [message];
    }
    return errorSchema;
  }, {});
}
/**
 * Method compile the schema nad formdata and gives the error json schema object
 * @param  {object} schema
 * @param  {object} formData
 * @returns {Boolean} false
 * @returns {object} errors
 */
export const getErrors = (schema, formData) => {
  let ajv = new Ajv.default({
    errorDataPath: "property",
    allErrors: true,
    multipleOfPrecision: 8
  });
  let validate = ajv.compile(schema);
  let valid = validate(formData);
  if (!valid) {
    const errors = transformAjvErrors(validate.errors);
    return toErrorSchema(errors);
  } else {
    return false;
  }
};

/**
 * Transforming the error output from ajv to format used by jsonschema.
 * At some point, components should be updated to support ajv.
 */
function transformAjvErrors(errors = []) {
  if (errors === null) {
    return [];
  }

  return errors.map(e => {
    const { dataPath, keyword, message, params } = e;
    let property = `${dataPath}`;

    // put data in expected format
    return {
      name: keyword,
      property,
      message,
      params, // specific to ajv
      stack: `${property} ${message}`.trim()
    };
  });
}
/**
 * Method give the value false if the no error in the schema
 * @param {object} errors
 */
export const hasErrors = errors => {
  if (!errors) {
    return false;
  }

  if (errors.hasOwnProperty("__errors") && Array.isArray(errors.__errors)) {
    return true;
  }
};
/**
 * Method used to get the maximum date
 * @param {object} idSchema
 * @returns {date}
 */
export function getMaxDate(idSchema) {
  if (idSchema == "dob") return new Date();
  return "2100-05-01";
}
/**
 * Method gives the first key of the error object
 * @param {object} obj
 * @returns {string} object key
 */
export function getFirstKey(obj) {
  for (o in obj) {
    return Object.keys(obj[o]);
  }
}

/**
 * Sort object properties (only own properties will be sorted).
 * @param {object} obj object to sort properties
 * @param {string|int} sortedBy 1 - sort object properties by specific value.
 * @param {bool} isNumericSort true - sort object properties
 * as numeric value, false - sort as string value.
 * @param {bool} reverse false - reverse sorting.
 * @returns {Array} array of items in [[key,value],[key,value],...] format.
 */
export function sortProperties(obj, sortedBy, isNumericSort, reverse) {
  sortedBy = sortedBy || 1; // by default first key
  isNumericSort = isNumericSort || false; // by default text sort
  reverse = reverse || false; // by default no reverse

  var reversed = reverse ? -1 : 1;

  var sortable = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }
  if (isNumericSort)
    sortable.sort(function (a, b) {
      return reversed * (a[1][sortedBy] - b[1][sortedBy]);
    });
  else
    sortable.sort(function (a, b) {
      var x = a[1][sortedBy].toLowerCase(),
        y = b[1][sortedBy].toLowerCase();
      return x < y ? reversed * -1 : x > y ? reversed : 0;
    });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

export function sortObjects(objects, sortedBy) {
  var newObject = [];

  var sortedArray = sortProperties(objects, sortedBy, true, false);
  for (var i = 0; i < sortedArray.length; i++) {
    var key = sortedArray[i][0];
    //var value = sortedArray[i][1];
    newObject.push(key);
  }

  return newObject;
}