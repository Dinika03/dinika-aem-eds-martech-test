/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-edc-credit-insurance.js
  var import_edc_credit_insurance_exports = {};
  __export(import_edc_credit_insurance_exports, {
    default: () => import_edc_credit_insurance_default
  });

  // tools/importer/parsers/credit-hero-page.js
  function parse(element, { document: document2 }) {
    const wrapper = element.querySelector(".header-wrapper") || element;
    const heading = wrapper.querySelector("h1, h2");
    const subtitle = wrapper.querySelector("p.description") || wrapper.querySelector("p");
    if (!heading && !subtitle) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (heading) {
      const h1 = document2.createElement("h1");
      h1.textContent = heading.textContent.trim();
      contentCell.push(h1);
    }
    if (subtitle && subtitle.textContent.trim()) {
      const p = document2.createElement("p");
      p.innerHTML = subtitle.innerHTML.trim();
      contentCell.push(p);
    }
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-page", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-columns-benefits.js
  var isColumn = (el) => !!el && !!el.classList && el.classList.contains("text") && el.classList.contains("aem-GridColumn--default--4");
  function parse2(element, { document: document2 }) {
    if (!element.parentNode) return;
    const columns = [element];
    let next = element.nextElementSibling;
    while (isColumn(next)) {
      columns.push(next);
      next = next.nextElementSibling;
    }
    const row = columns.map((col) => {
      const content = col.querySelector(".cmp-text") || col;
      const nodes = [...content.children].filter((n) => /^(H[1-6]|P|UL|OL)$/.test(n.tagName) && n.textContent.trim());
      return nodes.length ? nodes : "";
    });
    if (!row.some((c) => c)) {
      element.replaceWith(...element.childNodes);
      return;
    }
    columns.slice(1).forEach((col) => col.remove());
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-benefits", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-columns-highlight.js
  function parse3(element, { document: document2 }) {
    const image = element.querySelector(".banner-image img.banner-img") || element.querySelector(".banner-image picture img") || element.querySelector("img:not(.risk-icon)");
    const content = element.querySelector(".banner-content") || element;
    const heading = content.querySelector("h2, h3, .section-title");
    const description = content.querySelector(".section-description");
    const textCell = [];
    if (heading) {
      const h2 = document2.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textCell.push(h2);
    }
    if (description) {
      [...description.children].filter((n) => /^(P|UL|OL|H[3-6])$/.test(n.tagName) && n.textContent.trim()).forEach((n) => textCell.push(n));
    }
    content.querySelectorAll(".tips-info-items ul").forEach((ul) => {
      if (ul.querySelector("li") && ul.textContent.trim()) textCell.push(ul);
    });
    if (!image && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell.length ? textCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-highlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-table-compare.js
  function parse4(element, { document: document2 }) {
    const table = element.querySelector("table");
    if (!table) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const isBlank = (node) => node.nodeName === "BR" || node.nodeType === 3 && !node.textContent.replace(/ /g, " ").trim();
    const cells = [...table.querySelectorAll("tr")].map((tr) => [...tr.children].filter((td) => /^(TD|TH)$/.test(td.tagName)).map((td) => {
      if (!td.textContent.replace(/ /g, " ").trim() && !td.querySelector("img, a")) return "";
      while (td.lastChild && isBlank(td.lastChild)) td.lastChild.remove();
      return [...td.childNodes];
    }));
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const width = Math.max(...cells.map((r) => r.length));
    cells.forEach((r) => {
      while (r.length < width) r.push("");
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "table-compare", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-cta-band.js
  function parse5(element, { document: document2 }) {
    const bandLink = element.querySelector("a.triage-cta-link, a[href]");
    const content = element.querySelector(".content-wrapper") || element;
    const heading = content.querySelector(".title-wrapper h2") || content.querySelector("h2, h3") || content.querySelector(".title");
    const contentCell = [];
    const href = bandLink && bandLink.getAttribute("href") || "/";
    if (heading && href) {
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = heading.textContent.trim();
      heading.textContent = "";
      heading.append(link);
      contentCell.push(heading);
    } else if (heading) {
      contentCell.push(heading);
    } else if (href) {
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = (bandLink.textContent || "").trim() || "Learn more";
      contentCell.push(link);
    }
    if (!contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "cta-band (rounded)", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-form-leadgen.js
  function parse6(element, { document: document2 }) {
    const form = element.querySelector("form.email-section") || element.querySelector("form") || element;
    const heading = form.querySelector(".form-wrapper h2") || form.querySelector("h2");
    let intro = null;
    if (heading) {
      let sib = heading.nextElementSibling;
      while (sib && sib.tagName !== "P" && !sib.matches(".form-group, .form-disclaimer")) sib = sib.nextElementSibling;
      if (sib && sib.tagName === "P" && sib.textContent.trim()) intro = sib;
    }
    const group = form.querySelector(".form-group");
    const label = group ? group.querySelector("label") : form.querySelector("label");
    const input = form.querySelector('input[type="email"]') || form.querySelector("input.email-submit") || form.querySelector('input[name="emailAddress"], input#emailAddress');
    const consent = form.querySelector(".form-disclaimer .text") || form.querySelector(".form-disclaimer");
    const button = form.querySelector('button[type="submit"]') || form.querySelector('button, input[type="submit"]');
    const cells = [];
    const labelText = label ? label.textContent.trim() : "";
    const placeholder = input && (input.getAttribute("placeholder") || "").trim() || "example@edc.ca";
    if (labelText || placeholder) cells.push(["Field", labelText || "Business e-mail address:", placeholder]);
    if (consent) {
      const consentNodes = [...consent.querySelectorAll(":scope > p")].filter((p) => p.textContent.trim());
      if (consentNodes.length) cells.push(["Consent", consentNodes, ""]);
      else if (consent.textContent.trim()) cells.push(["Consent", consent.textContent.trim(), ""]);
    }
    const buttonText = button ? (button.textContent || button.value || "").trim() : "";
    if (buttonText) cells.push(["Submit", buttonText, ""]);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (heading) {
      const h2 = document2.createElement("h2");
      h2.textContent = heading.textContent.trim();
      element.before(h2);
    }
    if (intro) element.before(intro);
    const block = WebImporter.Blocks.createBlock(document2, { name: "form-leadgen", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-columns-testimonial.js
  function parse7(element, { document: document2 }) {
    const quoteWrap = element.querySelector("blockquote #quote") || element.querySelector("blockquote") || element.querySelector(".testimonial__block-quote-wrapper");
    const author = element.querySelector("figcaption .author");
    const title = element.querySelector("figcaption .title") || element.querySelector("figcaption cite");
    const quoteCell = [];
    if (quoteWrap) {
      const paras = [...quoteWrap.querySelectorAll("p")].filter((p) => p.textContent.trim());
      if (paras.length) {
        quoteCell.push(...paras);
      } else if (quoteWrap.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = quoteWrap.textContent.trim();
        quoteCell.push(p);
      }
    }
    if (author && author.textContent.trim()) {
      const p = document2.createElement("p");
      const strong = document2.createElement("strong");
      strong.textContent = author.textContent.trim();
      p.append(strong);
      quoteCell.push(p);
    }
    if (title && title !== author && title.textContent.trim()) {
      const p = document2.createElement("p");
      const em = document2.createElement("em");
      em.textContent = title.textContent.trim();
      p.append(em);
      quoteCell.push(p);
    }
    const mediaWrap = element.querySelector(".testimonial__image-wrapper") || element;
    const image = mediaWrap.querySelector("img.cover-image") || mediaWrap.querySelector("picture img, img:not(.quote-icon)");
    const link = mediaWrap.querySelector(".testimonial__link-wrapper a[href]") || mediaWrap.querySelector("a.link[href]");
    const mediaCell = [];
    if (image) mediaCell.push(image);
    if (link) {
      const p = document2.createElement("p");
      p.append(link);
      mediaCell.push(p);
    }
    if (!quoteCell.length && !mediaCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[quoteCell.length ? quoteCell : "", mediaCell.length ? mediaCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-accordion-faq.js
  function parse8(element, { document: document2 }) {
    const sectionHeading = element.querySelector(":scope > h2");
    let items = [...element.querySelectorAll(".accordionitem")];
    if (!items.length) items = [...element.querySelectorAll(".panel")];
    const cells = [];
    items.forEach((item) => {
      const label = item.querySelector(".panel-label span") || item.querySelector(".panel-label") || item.querySelector(".button-heading, h3");
      const questionText = label ? label.textContent.replace(/\s+/g, " ").trim() : "";
      if (!questionText) return;
      const panel = item.querySelector(".panel-content");
      let answer = [];
      if (panel) {
        const texts = [...panel.querySelectorAll(".cmp-text")];
        const sources = texts.length ? texts : [panel];
        sources.forEach((src) => {
          [...src.children].forEach((n) => {
            if (n.textContent.trim() || n.querySelector("img")) answer.push(n);
          });
        });
        if (!answer.length && panel.textContent.trim()) answer = [panel.textContent.trim()];
      }
      const q = document2.createElement("p");
      q.textContent = questionText;
      cells.push([q, answer.length ? answer : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (sectionHeading) element.before(sectionHeading);
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/credit-columns-inquiry.js
  function parse9(element, { document: document2 }) {
    const left = element.querySelector(".panel-left") || element;
    const right = element.querySelector(".panel-right") || element;
    const image = left.querySelector("img.inq-image") || left.querySelector("picture img, img");
    const textCell = [];
    const heading = right.querySelector("h2, h3, .inq-title");
    if (heading) {
      const h2 = document2.createElement("h2");
      h2.textContent = heading.textContent.trim();
      textCell.push(h2);
    }
    [...right.querySelectorAll(":scope > p")].forEach((p) => {
      if (p.textContent.trim()) textCell.push(p);
    });
    [...right.querySelectorAll(":scope > a[href]")].forEach((a) => {
      const p = document2.createElement("p");
      p.append(a);
      textCell.push(p);
    });
    if (!image && !textCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell.length ? textCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-inquiry", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/credit-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  var TRACKING_ATTR_RE = /^(data-(cmp|track|tracking|analytics|layer|gtm|adobe|link|component)|on[a-z]+$)/i;
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        "div.grecaptcha-badge",
        'iframe[title="reCAPTCHA"]',
        "iframe.ot-text-resize"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "div.header.aem-GridColumn",
        "div.headerv2",
        "div.cmp-headerv2",
        "a#skip-button",
        "#skip-to-main-content"
      ]);
      element.querySelectorAll("header").forEach((h) => {
        if (!h.classList.contains("c-l2-header")) h.remove();
      });
      WebImporter.DOMUtils.remove(element, [
        "div.footer.aem-GridColumn",
        "#footerv2"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "div.pagelevelfeedback",
        "div.responsivegrid.homepage-flag"
      ]);
      const leadGen = element.querySelector("section.c-gated-lead-gen-form");
      if (leadGen) {
        leadGen.querySelectorAll("form.form-section.hide, div.thanks-section.hide, div.submit-failed-message.hide").forEach((el) => el.remove());
        const processing = leadGen.querySelector("div.c-processing-screen");
        if (processing) {
          const wrapper = processing.parentElement;
          if (wrapper && wrapper !== leadGen && wrapper.children.length === 1) wrapper.remove();
          else processing.remove();
        }
      }
      WebImporter.DOMUtils.remove(element, ["script", "style", "link", "noscript"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.header.aem-GridColumn",
        "div.footer.aem-GridColumn",
        "#footerv2",
        "#onetrust-consent-sdk",
        "div.grecaptcha-badge",
        "div.pagelevelfeedback",
        "iframe",
        "script",
        "style",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("a[href]").forEach((a) => {
        const href = (a.getAttribute("href") || "").trim();
        if (/^(mailto:|tel:)/i.test(href)) return;
        if (href.startsWith("#") && href.length > 1) return;
        a.setAttribute("href", "/");
      });
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach(({ name }) => {
          if (name === SECTION_MARKER_ATTR) return;
          if (TRACKING_ATTR_RE.test(name)) el.removeAttribute(name);
        });
      });
      const KEEP = "img, picture, video, table, hr, br, svg, input, select, textarea, button, a";
      [...element.querySelectorAll("div, span")].reverse().forEach((el) => {
        if (el.closest("table")) return;
        if (el.hasAttribute(SECTION_MARKER_ATTR)) return;
        if (el.textContent.trim() !== "") return;
        if (el.querySelector(KEEP)) return;
        el.remove();
      });
    }
  }

  // tools/importer/transformers/credit-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SECTION_MARKER_ATTR2 = "data-excat-section-id";
  function toSelectorList(selector) {
    if (!selector) return [];
    return Array.isArray(selector) ? selector : [selector];
  }
  function querySection(root, selector) {
    const list = toSelectorList(selector);
    for (let i = 0; i < list.length; i += 1) {
      const el = root.querySelector(list[i]);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument || document;
    if (hookName === TransformHook2.beforeTransform) {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section) continue;
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = doc.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR2, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === TransformHook2.afterTransform) {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR2}="${section.id}"]`);
        const sectionEl = querySection(element, section.selector);
        const anchor = sectionEl || marker;
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR2);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-edc-credit-insurance.js
  var PAGE_TEMPLATE = {
    "name": "edc-credit-insurance",
    "description": "EDC credit insurance solution page. Imported to /dinika-edc-credit-insurance-test. Uses EDC nav/footer; body links rewritten to /.",
    "urls": [
      "https://www.edc.ca/en/solutions/insurance/credit-insurance.html"
    ],
    "blocks": [
      {
        "name": "hero-page",
        "instances": [
          "header.c-l2-header"
        ]
      },
      {
        "name": "columns-benefits",
        "instances": [
          "div.text.aem-GridColumn--default--4"
        ]
      },
      {
        "name": "columns-highlight",
        "instances": [
          "div.product-highlight-banner"
        ]
      },
      {
        "name": "table-compare",
        "instances": [
          "section.table"
        ]
      },
      {
        "name": "cta-band",
        "instances": [
          "section.c-triage-cta"
        ]
      },
      {
        "name": "form-leadgen",
        "instances": [
          "section.c-gated-lead-gen-form"
        ]
      },
      {
        "name": "columns-testimonial",
        "instances": [
          "section.c-testimonial-quote"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          "div.new-accordion"
        ]
      },
      {
        "name": "columns-inquiry",
        "instances": [
          "section.inquiry-submission"
        ]
      }
    ],
    "sections": [
      {
        "id": "rc1",
        "name": "page-header",
        "selector": [
          "div.l2header"
        ],
        "style": null,
        "blocks": [
          "hero-page"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "benefits",
        "selector": [
          "div.text.aem-GridColumn--phone--none.aem-GridColumn--default--12"
        ],
        "style": null,
        "blocks": [
          "columns-benefits"
        ],
        "defaultContent": [
          "div.text.aem-GridColumn--phone--none.aem-GridColumn--default--12 h2",
          "div.text.aem-GridColumn--phone--none.aem-GridColumn--default--12 p"
        ]
      },
      {
        "id": "rc3",
        "name": "highlight",
        "selector": [
          "div.producthighlightbanner"
        ],
        "style": null,
        "blocks": [
          "columns-highlight"
        ],
        "defaultContent": []
      },
      {
        "id": "rc4",
        "name": "coverage-options",
        "selector": [
          "div.text.aem-GridColumn--phone--hide"
        ],
        "style": null,
        "blocks": [
          "table-compare",
          "cta-band"
        ],
        "defaultContent": [
          "div.text.aem-GridColumn--phone--hide h2",
          "div.text.aem-GridColumn--phone--hide p"
        ]
      },
      {
        "id": "rc5",
        "name": "lead-gen",
        "selector": [
          "div.bluebackgroundcontainer",
          "div.gatedleadgenform"
        ],
        "style": "light-blue",
        "blocks": [
          "form-leadgen"
        ],
        "defaultContent": [
          "section.c-gated-lead-gen-form h2",
          "section.c-gated-lead-gen-form h2 + p"
        ]
      },
      {
        "id": "rc6",
        "name": "testimonial",
        "selector": [
          "div.testimonialquote"
        ],
        "style": null,
        "blocks": [
          "columns-testimonial"
        ],
        "defaultContent": []
      },
      {
        "id": "rc7",
        "name": "faq",
        "selector": [
          "div.accordionwrapper"
        ],
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          "div.new-accordion > h2"
        ]
      },
      {
        "id": "rc8",
        "name": "inquiry",
        "selector": [
          "div.inquirysubmission"
        ],
        "style": null,
        "blocks": [
          "columns-inquiry"
        ],
        "defaultContent": [
          "div.modifieddate"
        ]
      }
    ]
  };
  var parsers = {
    "hero-page": parse,
    "columns-benefits": parse2,
    "columns-highlight": parse3,
    "table-compare": parse4,
    "cta-band": parse5,
    "form-leadgen": parse6,
    "columns-testimonial": parse7,
    "accordion-faq": parse8,
    "columns-inquiry": parse9
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.filter((blockDef) => !blockDef.name.startsWith("section-")).forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_edc_credit_insurance_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !/^(https?:)?\/\//i.test(src) && !src.startsWith("data:") && !src.startsWith("/") && !src.startsWith("./") && !src.startsWith("../")) {
          try {
            img.src = new URL(src, url).toString();
          } catch (e) {
          }
        }
      });
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath("/dinika-edc-credit-insurance-test");
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_edc_credit_insurance_exports);
})();
