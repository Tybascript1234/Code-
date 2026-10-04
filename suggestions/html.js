(function (global) {
  'use strict';

  // HTML elements and attributes from the current HTML standard, plus common legacy elements.
  const elements = `a abbr acronym address applet area article aside audio b base basefont bdi bdo bgsound big blockquote body br button canvas caption center cite code col colgroup content data datalist dd del details dfn dialog dir div dl dt element em embed fieldset figcaption figure font footer form frame frameset g h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe image img input ins isindex kbd keygen label legend li link listing main map mark marquee menu menuitem meta meter multicol nav nextid nobr noembed noframes noscript object ol optgroup option output p param picture plaintext portal pre progress q rb rp rt rtc ruby s samp script search section select selectedcontent shadow slot small source spacer span strike strong style sub summary sup svg table tbody td template textarea tfoot th thead time title tr track tt u ul var video wbr xmp`.split(/\s+/);

  const elementDetails = {
    // a: 'رابط إلى صفحة أو موضع', button: 'زر تفاعلي', span: 'عنصر نصي داخل السطر', div: 'حاوية عامة',
    // p: 'فقرة نصية', input: 'حقل إدخال', img: 'صورة مع وصف بديل', form: 'نموذج لإرسال البيانات',
    // section: 'قسم موضوعي في الصفحة', article: 'محتوى مستقل', header: 'مقدمة الصفحة أو القسم',
    // footer: 'تذييل الصفحة أو القسم', nav: 'مجموعة روابط التنقل', main: 'المحتوى الرئيسي',
    // label: 'تسمية لحقل إدخال', textarea: 'حقل نص متعدد الأسطر', select: 'قائمة اختيار',
    // ul: 'قائمة غير مرتبة', ol: 'قائمة مرتبة', li: 'عنصر قائمة', h1: 'عنوان رئيسي',
    // h2: 'عنوان فرعي', table: 'جدول بيانات', video: 'مشغل فيديو', audio: 'مشغل صوت'
  };
  const voidElements = new Set(`area base br col embed hr img input link meta param source track wbr`.split(/\s+/));
  const globalAttributes = `accesskey autocapitalize autofocus class contenteditable data-* dir draggable enterkeyhint hidden id inert inputmode lang nonce part slot spellcheck style tabindex title translate role aria-*`.split(/\s+/);
  const eventAttributes = `onabort onauxclick onbeforeinput onblur oncancel oncanplay onchange onclick onclose oncontextmenu oncopy oncuechange oncut ondblclick ondrag ondragend ondragenter ondragleave ondragover ondragstart ondrop ondurationchange onemptied onended onerror onfocus onformdata oninput oninvalid onkeydown onkeypress onkeyup onload onloadeddata onloadedmetadata onloadstart onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup onpaste onpause onplay onplaying onprogress onratechange onreset onresize onscroll onsecuritypolicyviolation onseeked onseeking onselect onslotchange onstalled onsubmit onsuspend ontimeupdate ontoggle onvolumechange onwaiting onwheel`.split(/\s+/);
  const commonAttributes = `accept accept-charset action allow allowfullscreen alt async autocapitalize autocomplete autoplay capture charset checked cite class cols colspan content controls coords crossorigin data datetime decoding default defer dir disabled download enctype for form formaction formenctype formmethod formnovalidate formtarget height href hreflang http-equiv integrity ismap kind label list loop max maxlength media method min minlength multiple muted name novalidate open pattern placeholder playsinline poster preload readonly rel required reversed rows rowspan sandbox scope selected shape size sizes src srcdoc srclang srcset start step target type usemap value width wrap`.split(/\s+/);

  function source(cm) {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line).slice(0, cursor.ch);
    let match = line.match(/<([a-z][\w-]*)?$/i);
    if (match) {
      const query = (match[1] || '').toLowerCase();
      const from = { line: cursor.line, ch: cursor.ch - query.length - 1 };
      const items = elements.filter(tag => tag.startsWith(query)).map(tag => {
        const insert = voidElements.has(tag) ? `<${tag}>` : `<${tag}></${tag}>`;
        const cursorOffset = voidElements.has(tag) ? insert.length : tag.length + 2;
        return { label: `<${tag}>`, detail: elementDetails[tag] || '', insert, cursor: cursorOffset };
      });
      return { from, items };
    }

    match = line.match(/<([a-z][\w-]*)\s+([\w:-]*)$/i);
    if (!match) return null;
    const query = (match[2] || '').toLowerCase();
    const tag = match[1].toLowerCase();
    const attributes = new Set([...globalAttributes, ...eventAttributes, ...commonAttributes]);
    if (tag === 'a') ['href', 'hreflang', 'target', 'rel', 'download', 'ping', 'referrerpolicy'].forEach(x => attributes.add(x));
    if (tag === 'img') ['src', 'srcset', 'alt', 'width', 'height', 'loading', 'decoding', 'fetchpriority'].forEach(x => attributes.add(x));
    if (tag === 'input') ['type', 'name', 'value', 'placeholder', 'required', 'checked', 'disabled', 'min', 'max', 'step', 'pattern', 'autocomplete'].forEach(x => attributes.add(x));
    if (tag === 'button') ['type', 'name', 'value', 'disabled', 'form', 'formaction', 'formmethod'].forEach(x => attributes.add(x));
    const from = { line: cursor.line, ch: cursor.ch - query.length };
    const items = [...attributes].filter(name => name.startsWith(query)).sort().map(name => {
      const insert = name === 'class' || name === 'id' || name.startsWith('aria-') || name.startsWith('data-')
        ? `${name}=""` : `${name}=""`;
      return { label: name, detail: 'خاصية HTML', insert, cursor: insert.length - 1 };
    });
    return { from, items };
  }

  global.EditorSuggestionSources = global.EditorSuggestionSources || {};
  global.EditorSuggestionSources.html = source;
})(window);
