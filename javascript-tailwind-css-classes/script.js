'use strict';

(function () {
  const CLASS_TO_CSS_PROPERTY_MAP = {
    m: 'margin',
    mx: ['margin-left', 'margin-right'],
    my: ['margin-top', 'margin-bottom'],
    mt: 'margin-top',
    mr: 'margin-right',
    mb: 'margin-bottom',
    ml: 'margin-left',
    ms: 'margin-inline-start',
    me: 'margin-inline-end',
    p: 'padding',
    px: ['padding-left', 'padding-right'],
    py: ['padding-top', 'padding-bottom'],
    pt: 'padding-top',
    pr: 'padding-right',
    pb: 'padding-bottom',
    pl: 'padding-left',
    ps: 'padding-inline-start',
    pe: 'padding-inline-end',

    w: 'width',
    h: 'height',
    size: ['width', 'height'],
    'min-w': 'min-width',
    'max-w': 'max-width',
    'min-h': 'min-height',
    'max-h': 'max-height',

    border: 'border-width',
    'border-t': 'border-top-width',
    'border-r': 'border-right-width',
    'border-b': 'border-bottom-width',
    'border-l': 'border-left-width',
    'border-x': ['border-left-width', 'border-right-width'],
    'border-y': ['border-top-width', 'border-bottom-width'],
    rounded: 'border-radius',
    'rounded-t': ['border-top-left-radius', 'border-top-right-radius'],
    'rounded-r': ['border-top-right-radius', 'border-bottom-right-radius'],
    'rounded-b': ['border-bottom-left-radius', 'border-bottom-right-radius'],
    'rounded-l': ['border-top-left-radius', 'border-bottom-left-radius'],
    'rounded-tl': 'border-top-left-radius',
    'rounded-tr': 'border-top-right-radius',
    'rounded-bl': 'border-bottom-left-radius',
    'rounded-br': 'border-bottom-right-radius',

    bg: 'background',

    text: 'font-size',
    font: 'font-weight',
    tracking: 'letter-spacing',
    leading: 'line-height',
    indent: 'text-indent',

    gap: 'gap',
    'gap-x': 'column-gap',
    'gap-y': 'row-gap',
    basis: 'flex-basis',
    grow: 'flex-grow',
    shrink: 'flex-shrink',
    order: 'order',
    columns: 'columns',

    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
    inset: 'inset',
    'inset-x': ['left', 'right'],
    'inset-y': ['top', 'bottom'],
    z: 'z-index',

    opacity: 'opacity',
    blur: 'filter',
    shadow: 'box-shadow',

    duration: 'transition-duration',
    delay: 'transition-delay',
    ease: 'transition-timing-function',

    scale: ['scale-x', 'scale-y'],
    'scale-x': 'scale-x',
    'scale-y': 'scale-y',
    rotate: 'rotate',
    'translate-x': 'translate-x',
    'translate-y': 'translate-y',

    accent: 'accent-color',
    outline: 'outline-width',
    'outline-offset': 'outline-offset',
    ring: 'box-shadow',
    'ring-offset': 'box-shadow',
    caret: 'caret-color',
    stroke: 'stroke-width',
    fill: 'fill',
  };

  function extractTWCSSValue(value = '') {
    if (!value) return '';

    const val = value.trim();

    if (val.startsWith('[') && val.endsWith(']')) {
      return val.slice(1, -1).replace(/_/g, ' ');
    }

    if (/^\d+(\.\d+)?$/.test(val)) {
      return `${val}px`;
    }

    if (
      /^\d+(\.\d+)?(rem|em|%|vh|vw|dvh|svh|ch|ex|px|pt|cm|mm|in)$/.test(val)
    ) {
      return val;
    }

    return val;
  }

  function extractTWCSSProperty(value = '', styleValue = '') {
    if (!value) return '';

    const val = value.trim();
    const entry = CLASS_TO_CSS_PROPERTY_MAP[val];

    if (!entry) return '';

    const isColor = /^(?:#|hsla?\(|rgba?\()/.test(styleValue.trim());
    const suffix = isColor ? '-color' : '';

    const props = Array.isArray(entry) ? entry : [entry];

    const result = props.map((prop) => `${prop}${suffix}`);

    return result.length === 1 ? result[0] : result;
  }

  function extractTWClasses(element = null) {
    if (!element) return;
    if (!element.getAttribute('class')) return;

    const classes = element.className.split(' ');
    const customValueClasses = classes.filter((cl) => cl.includes('-'));

    return customValueClasses.map((c) => {
      let parts = c.split('-');
      let cssValue = extractTWCSSValue(parts[1]);
      let cssProp = extractTWCSSProperty(parts[0], cssValue);
      return {
        property: cssProp,
        value: cssValue,
        cssClass: c,
      };
    });
  }

  function escapeCSSClass(value = '') {
    if (!value) {
      return '';
    }
    return CSS.escape(value);
  }

  function applyTWClasses(element = null) {
    if (!element) return;

    const cssClasses = extractTWClasses(element);
    if (cssClasses.length === 0) return;

    let styleElement = document.getElementById('tw-dynamic-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'tw-dynamic-styles';
      document.head.appendChild(styleElement);
    }

    const sheet = styleElement.sheet;
    const existingRules = new Set(
      Array.from(sheet.cssRules, (rule) => rule.cssText),
    );

    for (const cls of cssClasses) {
      const properties = Array.isArray(cls.property)
        ? cls.property
        : [cls.property];

      const declarations = properties
        .map((prop) => `${prop}: ${cls.value}`)
        .join('; ');

      const rule = `.${escapeCSSClass(cls.cssClass)} { ${declarations} }`;

      if (!existingRules.has(rule)) {
        sheet.insertRule(rule, sheet.cssRules.length);
        existingRules.add(rule);
      }
    }
  }

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      const element = document.querySelector('div');
      applyTWClasses(element);
    },
    false,
  );
})();
