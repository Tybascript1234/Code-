(function (global) {
  'use strict';

  // CSS properties across layout, typography, animation, transforms, SVG and modern UI.
  // CSSWG CSS Snapshot 2026 property index plus widely used modern properties.
  const properties = `--* accent-color align-content align-items align-self all animation animation-composition animation-delay animation-direction animation-duration animation-fill-mode animation-iteration-count animation-name animation-play-state animation-range animation-timeline animation-timing-function appearance aspect-ratio azimuth backdrop-filter backface-visibility background background-attachment background-blend-mode background-clip background-color background-image background-origin background-position background-repeat background-size block-size border border-block border-block-color border-block-end border-block-end-color border-block-end-style border-block-end-width border-block-start border-block-start-color border-block-start-style border-block-start-width border-block-style border-block-width border-bottom border-bottom-color border-bottom-left-radius border-bottom-right-radius border-bottom-style border-bottom-width border-collapse border-color border-end-end-radius border-end-start-radius border-image border-image-outset border-image-repeat border-image-slice border-image-source border-image-width border-inline border-inline-color border-inline-end border-inline-end-color border-inline-end-style border-inline-end-width border-inline-start border-inline-start-color border-inline-start-style border-inline-start-width border-inline-style border-inline-width border-left border-left-color border-left-style border-left-width border-radius border-right border-right-color border-right-style border-right-width border-spacing border-start-end-radius border-start-start-radius border-style border-top border-top-color border-top-left-radius border-top-right-radius border-top-style border-top-width border-width bottom box-decoration-break box-shadow box-sizing break-after break-before break-inside caption-side caret-color clear clip clip-path clip-rule color color-adjust color-interpolation-filters color-scheme column-count column-fill column-gap column-rule column-rule-color column-rule-style column-rule-width columns column-span column-width contain contain-intrinsic-size container container-name container-type content content-visibility counter-increment counter-reset counter-set cursor direction display elevation empty-cells filter flex flex-basis flex-direction flex-flow flex-grow flex-shrink flex-wrap float flood-color flood-opacity font font-family font-feature-settings font-kerning font-language-override font-optical-sizing font-palette font-size font-size-adjust font-stretch font-style font-synthesis font-synthesis-position font-synthesis-small-caps font-synthesis-style font-synthesis-weight font-variant font-variant-alternates font-variant-caps font-variant-east-asian font-variant-emoji font-variant-ligatures font-variant-numeric font-variant-position font-variation-settings font-weight font-width forced-color-adjust gap glyph-orientation-vertical grid grid-area grid-auto-columns grid-auto-flow grid-auto-rows grid-column grid-column-end grid-column-gap grid-column-start grid-gap grid-row grid-row-end grid-row-gap grid-row-start grid-template grid-template-areas grid-template-columns grid-template-rows hanging-punctuation height hyphens image-orientation image-rendering inline-size inset inset-block inset-block-end inset-block-start inset-inline inset-inline-end inset-inline-start inset-inline isolation justify-content justify-items justify-self left letter-spacing lighting-color line-break line-height list-style list-style-image list-style-position list-style-type margin margin-block margin-block-end margin-block-start margin-bottom margin-inline margin-inline-end margin-inline-start margin-left margin-right margin-top marker-end marker-mid marker-side marker-start mask mask-border mask-border-mode mask-border-outset mask-border-repeat mask-border-slice mask-border-source mask-border-width mask-clip mask-composite mask-image mask-mode mask-origin mask-position mask-repeat mask-size mask-type max-block-size max-height max-inline-size max-width min-block-size min-height min-inline-size min-width mix-blend-mode object-fit object-position offset offset-anchor offset-distance offset-path offset-position offset-rotate opacity order orphans outline outline-color outline-offset outline-style outline-width overflow overflow-anchor overflow-clip-margin overflow-wrap overflow-x overflow-y overscroll-behavior overscroll-behavior-block overscroll-behavior-inline overscroll-behavior-x overscroll-behavior-y padding padding-block padding-block-end padding-block-start padding-bottom padding-inline padding-inline-end padding-inline-start padding-left padding-right padding-top page-break-after page-break-before page-break-inside paint-order perspective perspective-origin pitch pitch-range place-content place-items place-self play-during pointer-events position print-color-adjust property-name quotes resize rest rest-after rest-before richness right rotate row-gap ruby-align ruby-position scale scroll-behavior scroll-margin scroll-margin-block scroll-margin-block-end scroll-margin-block-start scroll-margin-bottom scroll-margin-inline scroll-margin-inline-end scroll-margin-inline-start scroll-margin-left scroll-margin-right scroll-margin-top scroll-padding scroll-padding-block scroll-padding-block-end scroll-padding-block-start scroll-padding-bottom scroll-padding-inline scroll-padding-inline-end scroll-padding-inline-start scroll-padding-left scroll-padding-right scroll-padding-top scroll-snap-align scroll-snap-stop scroll-snap-type scrollbar-color scrollbar-gutter scrollbar-width shape-image-threshold shape-margin shape-outside speak speak-as speak-header speak-numeral speak-punctuation speech-rate stress table-layout tab-size text-align text-align-all text-align-last text-combine-upright text-decoration text-decoration-color text-decoration-line text-decoration-style text-decoration-thickness text-emphasis text-emphasis-color text-emphasis-position text-emphasis-style text-indent text-justify text-orientation text-overflow text-rendering text-shadow text-transform text-underline-offset text-underline-position top touch-action transform transform-box transform-origin transform-style transition transition-delay transition-duration transition-property transition-timing-function translate unicode-bidi user-select vertical-align view-transition-name visibility voice-balance voice-duration voice-family voice-pitch voice-range voice-rate voice-stress voice-volume volume white-space widows width will-change word-break word-spacing word-wrap writing-mode z-index`.split(/\s+/);

  const commonValues = `inherit initial revert revert-layer unset none auto normal`.split(/\s+/);
  const valueSets = {
    display: `block inline inline-block flex inline-flex grid inline-grid flow-root contents list-item table table-row table-cell none` ,
    position: `static relative absolute fixed sticky`,
    'flex-direction': `row row-reverse column column-reverse`,
    'flex-wrap': `nowrap wrap wrap-reverse`,
    'justify-content': `normal start end center flex-start flex-end left right space-between space-around space-evenly stretch`,
    'align-items': `normal start end center flex-start flex-end self-start self-end stretch baseline`,
    'text-align': `start end left right center justify match-parent`,
    'font-weight': `normal bold bolder lighter 100 200 300 400 500 600 700 800 900`,
    'font-style': `normal italic oblique`,
    'overflow': `visible hidden clip scroll auto`,
    'overflow-x': `visible hidden clip scroll auto`,
    'overflow-y': `visible hidden clip scroll auto`,
    'box-sizing': `content-box border-box`,
    'text-decoration': `none underline overline line-through`,
    'text-transform': `none capitalize uppercase lowercase`,
    'white-space': `normal nowrap pre pre-wrap pre-line break-spaces`,
    'object-fit': `fill contain cover none scale-down`,
    'cursor': `auto default none context-menu help pointer progress wait cell crosshair text move not-allowed grab grabbing`,
    'flex': `1 1 auto 0 0 auto none`,
    'background-repeat': `repeat repeat-x repeat-y no-repeat space round`,
    'background-size': `auto cover contain`,
    'border-style': `none hidden dotted dashed solid double groove ridge inset outset`,
    'list-style-type': `disc circle square decimal lower-alpha upper-alpha lower-roman upper-roman none`,
    'visibility': `visible hidden collapse`,
    'user-select': `auto text none contain all`,
    'pointer-events': `auto none visible painted`,
    'animation-direction': `normal reverse alternate alternate-reverse`,
    'animation-fill-mode': `none forwards backwards both`,
    'transition-timing-function': `ease linear ease-in ease-out ease-in-out step-start step-end`,
    'scroll-behavior': `auto smooth`,
    'vertical-align': `baseline sub super text-top text-bottom middle top bottom`,
    'float': `left right inline-start inline-end none`,
    'clear': `left right inline-start inline-end both none`,
    'grid-auto-flow': `row column dense row dense column dense`,
    'align-content': `normal start end center flex-start flex-end space-between space-around space-evenly stretch`,
    'place-items': `normal start end center stretch baseline`,
    'aspect-ratio': `auto 1 / 1 16 / 9 4 / 3`
  };
  const colors = `transparent currentColor black white red green blue gray grey orange purple yellow pink inherit`.split(/\s+/);

  function source(cm) {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line).slice(0, cursor.ch);
    let match = line.match(/([\w-]+)\s*:\s*([^;{}]*)$/);
    if (match) {
      const property = match[1].toLowerCase();
      const valuePrefix = (match[2].match(/[\w-]*$/) || [''])[0].toLowerCase();
      const candidates = [...new Set([...(valueSets[property] || '').split(/\s+/).filter(Boolean), ...commonValues, ...colors])];
      const items = candidates.filter(value => value.toLowerCase().startsWith(valuePrefix)).map(value => ({
        label: value, detail: `قيمة مقترحة لـ ${property}`, insert: value
      }));
      return { from: { line: cursor.line, ch: cursor.ch - valuePrefix.length }, items };
    }

    match = line.match(/(?:^|[;{}])\s*([\w-]*)$/);
    if (!match) return null;
    const query = match[1].toLowerCase();
    const items = properties.filter(property => property.startsWith(query)).map(property => ({
      label: property, detail: 'خاصية CSS', insert: `${property}: `
    }));
    return { from: { line: cursor.line, ch: cursor.ch - query.length }, items };
  }

  global.EditorSuggestionSources = global.EditorSuggestionSources || {};
  global.EditorSuggestionSources.css = source;
})(window);
