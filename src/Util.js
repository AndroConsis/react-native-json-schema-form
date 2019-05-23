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
    sortable.sort(function(a, b) {
      return reversed * (a[1][sortedBy] - b[1][sortedBy]);
    });
  else
    sortable.sort(function(a, b) {
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
