// Memoized maps of attribute to property names and vice versa.
const attributeToPropertyNames = {};
const propertyNamesToAttributes = {};


export default function AttributeMarshallingMixin(Base) {
  return class AttributeMarshalling extends Base {
    /**
     * Handle a change to the attribute with the given name.
     */
    attributeChangedCallback(attributeName, oldValue, newValue) {
      if (super.attributeChangedCallback) { super.attributeChangedCallback(); }
      const propertyName = attributeToPropertyName(attributeName);
      // If the attribute name corresponds to a property name, set the property.
      if (propertyName in this) {
        this[propertyName] = newValue;
      }
    }

    static get observedAttributes() {
      return attributesForClass(this);
    }
  }
}


/**
 * Return the custom attributes for the given class.
 */
function attributesForClass(classFn) {

  // We treat the HTMLElement base class as if it has no attributes, since we
  // don't want to receive attributeChangedCallback for it. We'd like to do
  // a simple check if classFn === HTMLElement, but this fails in the polyfill
  // under IE, so we compare prototypes instead.
  if (classFn.prototype === HTMLElement.prototype) {
    return [];
  }

  // Get attributes for parent class.
  const baseClass = Object.getPrototypeOf(classFn.prototype).constructor;
  // See if parent class defines observedAttributes manually.
  let baseAttributes = baseClass.observedAttributes;
  if (!baseAttributes) {
    // Calculate parent class attributes ourselves.
    baseAttributes = attributesForClass(baseClass);
  }

  // Get attributes for this class.
  const propertyNames = Object.getOwnPropertyNames(classFn.prototype);
  const setterNames = propertyNames.filter(propertyName =>
    typeof Object.getOwnPropertyDescriptor(
      classFn.prototype, propertyName).set === 'function');
  const attributes = setterNames.map(setterName =>
    propertyNameToAttribute(setterName));

  // Merge.
  const diff = attributes.filter(attribute =>
    baseAttributes.indexOf(attribute) < 0);
  return baseAttributes.concat(diff);
}

/**
 * Convert hyphenated foo-bar attribute name to camel case fooBar property name.
 */
function attributeToPropertyName(attributeName) {
  let propertyName = attributeToPropertyNames[attributeName];
  if (!propertyName) {
    // Convert and memoize.
    const hyphenRegEx = /-([a-z])/g;
    propertyName = attributeName.replace(hyphenRegEx,
      match => match[1].toUpperCase());
    attributeToPropertyNames[attributeName] = propertyName;
  }
  return propertyName;
}

/**
 * Convert a camel case fooBar property name to a hyphenated foo-bar attribute.
 */
function propertyNameToAttribute(propertyName) {
  let attribute = propertyNamesToAttributes[propertyName];
  if (!attribute) {
    // Convert and memoize.
    const uppercaseRegEx = /([A-Z])/g;
    attribute = propertyName.replace(uppercaseRegEx, '-$1').toLowerCase();
  }
  return attribute;
}
