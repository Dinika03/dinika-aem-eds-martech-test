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

  // tools/importer/import-edc-test-page.js
  var import_edc_test_page_exports = {};
  __export(import_edc_test_page_exports, {
    default: () => import_edc_test_page_default
  });

  // tools/importer/parsers/edc-hero-edc.js
  function parse(element, { document }) {
    const bgPicture = element.querySelector(".bkg-image picture, .bkg-image img");
    const bgImage = bgPicture || element.querySelector("picture, img");
    const content = element.querySelector(".banner-content .body, .banner-content") || element;
    const heading = content.querySelector('h1, h2, .title, [class*="title"]');
    const description = content.querySelector('p, .description, [class*="description"]');
    const cta = content.querySelector('a.c-interaction-button, .banner-content a[href], a[class*="button"]');
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push([contentCell]);
    if (!heading && !description && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-edc", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/edc-cards-edc-support.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll("ol.cards-list > li, ul.cards-list > li, .cards-list > li"));
    const cells = [];
    cards.forEach((card) => {
      const cardEl = card.querySelector(".card") || card;
      const content = cardEl.querySelector(".content-wrapper") || cardEl;
      const heading = content.querySelector('h2, h3, h4, .title, [class*="title"]');
      const description = content.querySelector('p, .description, [class*="description"]');
      const cardLink = cardEl.querySelector("a.card-link, a[href]");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (cardLink && cardLink.getAttribute("href")) {
        const link = document.createElement("a");
        link.href = cardLink.getAttribute("href");
        const linkText = (cardLink.textContent || "").trim() || heading && heading.textContent.trim() || "Learn more";
        link.textContent = linkText;
        contentCell.push(link);
      }
      if (contentCell.length) cells.push([contentCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-edc-support", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/edc-tabs-insights.js
  function parse3(element, { document }) {
    const tabButtons = Array.from(element.querySelectorAll(".tabs > button, .tabs button"));
    const panels = Array.from(element.querySelectorAll(".tab-panels > .tab-content, .tab-content"));
    const cells = [];
    tabButtons.forEach((btn, i) => {
      const label = btn.querySelector("label") || btn;
      const labelText = (label.textContent || "").trim();
      const labelEl = document.createElement("p");
      labelEl.textContent = labelText;
      const panel = panels[i];
      const contentCell = [];
      if (panel) {
        const cardEls = Array.from(panel.querySelectorAll(".cards-container > .card, .card"));
        cardEls.forEach((card) => {
          const fullLink = card.querySelector("a.full-link, a[href]");
          const img = card.querySelector(".card-image img, img");
          const heading = card.querySelector('.card-link-title h3, h3, .title, [class*="title"]');
          if (img) contentCell.push(img);
          if (heading) {
            if (fullLink && fullLink.getAttribute("href")) {
              const link = document.createElement("a");
              link.href = fullLink.getAttribute("href");
              link.textContent = (heading.textContent || "").trim();
              contentCell.push(link);
            } else {
              contentCell.push(heading);
            }
          }
        });
        const moreLink = panel.querySelector('a.more-link, a[class*="more"]');
        if (moreLink && moreLink.getAttribute("href")) {
          const ml = document.createElement("a");
          ml.href = moreLink.getAttribute("href");
          ml.textContent = (moreLink.textContent || "").trim() || "More resources";
          contentCell.push(ml);
        }
      }
      cells.push([[labelEl], contentCell.length ? contentCell : [""]]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-insights", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/edc-cards-solutions.js
  var MIGRATED_CARD_LINKS = [
    { heading: /^trade credit insurance$/i, href: "/dinika-edc-credit-insurance-test" }
  ];
  function parse4(element, { document }) {
    const items = Array.from(element.querySelectorAll("ol.two-columns > li, ol > li, ul > li"));
    const cards = items.length ? items : Array.from(element.querySelectorAll(".card"));
    const cardEls = cards.map((c) => c.querySelector(":scope > .card") || (c.classList && c.classList.contains("card") ? c : c.querySelector(".card")) || c);
    const cells = [];
    cardEls.forEach((cardEl) => {
      if (!cardEl) return;
      const content = cardEl.querySelector(".content-wrapper") || cardEl;
      const icon = content.querySelector(".title-wrapper span img, .title-wrapper img, img.icon-image, img");
      const heading = content.querySelector('.title-wrapper h3, h3, .title, [class*="title"]');
      const description = content.querySelector('p.description, p, .description, [class*="description"]');
      const cardLink = cardEl.querySelector("a.card-link, a[href]");
      const bodyCell = [];
      const headingText = heading ? (heading.textContent || "").trim() : "";
      const migrated = MIGRATED_CARD_LINKS.find((m) => m.heading.test(headingText));
      if (heading && migrated) {
        const link = document.createElement("a");
        link.href = migrated.href;
        link.textContent = headingText;
        heading.textContent = "";
        heading.append(link);
        bodyCell.push(heading);
      } else if (heading) {
        if (cardLink && cardLink.getAttribute("href")) {
          const link = document.createElement("a");
          link.href = cardLink.getAttribute("href");
          link.textContent = (heading.textContent || "").trim();
          bodyCell.push(link);
        } else {
          bodyCell.push(heading);
        }
      }
      if (description) bodyCell.push(description);
      cells.push([icon || "", bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/edc-cta-band.js
  function parse5(element, { document }) {
    const bandLink = element.querySelector("a.triage-cta-link, a[href]");
    const content = element.querySelector(".content-wrapper") || element;
    const heading = content.querySelector('.title-wrapper h2, h2, h3, .title, [class*="title"]');
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (bandLink && bandLink.getAttribute("href")) {
      const link = document.createElement("a");
      link.href = bandLink.getAttribute("href");
      const label = (bandLink.textContent || "").trim() || heading && heading.textContent.trim() || "Learn more";
      link.textContent = label;
      contentCell.push(link);
    }
    if (!contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "cta-band", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/edc-cards-resources.js
  function parse6(element, { document }) {
    const items = Array.from(element.querySelectorAll("ol.cards-list > li, ul.cards-list > li, .cards-list > li"));
    const cells = [];
    items.forEach((item) => {
      const cardEl = item.querySelector(".card") || item;
      const content = cardEl.querySelector(".content-wrapper") || cardEl;
      const icon = content.querySelector("span img.icon-image, img.icon-image, span img, img");
      const heading = content.querySelector('h3.title, h2, h3, .title, [class*="title"]');
      const description = content.querySelector('p.description, p, .description, [class*="description"]');
      const cardLink = cardEl.querySelector("a.card-link, a[href]");
      const bodyCell = [];
      if (heading) {
        if (cardLink && cardLink.getAttribute("href")) {
          const link = document.createElement("a");
          link.href = cardLink.getAttribute("href");
          link.textContent = (heading.textContent || "").trim();
          bodyCell.push(link);
        } else {
          bodyCell.push(heading);
        }
      }
      if (description) bodyCell.push(description);
      cells.push([icon || "", bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/edc-cards-tiles.js
  function parse7(element, { document }) {
    const items = Array.from(element.querySelectorAll("ol.default-list > li, ul.default-list > li, ol > li, ul > li"));
    const cells = [];
    items.forEach((item) => {
      const cardEl = item.querySelector(".card") || item;
      const content = cardEl.querySelector(".content-wrapper") || cardEl;
      const image = cardEl.querySelector("img.bg-image, .card > img, img");
      const heading = content.querySelector('.title-wrapper h3, h2, h3, .title, [class*="title"]');
      const description = content.querySelector('p.description, p, .description, [class*="description"]');
      const tileLink = cardEl.querySelector(":scope > a[href], a[href]");
      const bodyCell = [];
      if (heading) {
        if (tileLink && tileLink.getAttribute("href")) {
          const link = document.createElement("a");
          link.href = tileLink.getAttribute("href");
          link.textContent = (heading.textContent || "").trim();
          bodyCell.push(link);
        } else {
          bodyCell.push(heading);
        }
      }
      if (description) bodyCell.push(description);
      cells.push([image || "", bodyCell.length ? bodyCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tiles", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/edc-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "div.ot-sdk-container",
        "div.grecaptcha-badge"
      ]);
      WebImporter.DOMUtils.remove(element, ["a#skip-button"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.header.aem-GridColumn",
        "div.cmp-headerv2",
        "div.headerv2",
        "div.footer.aem-GridColumn",
        "#footerv2",
        "div.subscriptioncentre",
        "div.categorylinks",
        "div.footnotes"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/edc-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(metadataBlock);
          }
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-edc-test-page.js
  var PAGE_TEMPLATE = {
    name: "edc-test-page",
    description: "EDC (Export Development Canada) homepage: promo bar, hero, support cards, insights tabs, solutions cards, solutions-finder CTA, resources cards, tailored-support cards. Imported to /edc-test-page.",
    urls: [
      "https://www.edc.ca/"
    ],
    blocks: [
      { name: "hero-edc", instances: ["div.top-banner-comp"] },
      { name: "cards-edc-support", instances: ["div.knowledgeandresources:nth-of-type(2) section.knowledge-and-resources"] },
      { name: "tabs-insights", instances: ["div.export-trends"] },
      { name: "cards-solutions", instances: ["div.homepageproductcard"] },
      { name: "cta-band", instances: ["section.c-triage-cta"] },
      { name: "cards-resources", instances: ["div.knowledgeandresources:nth-of-type(6) section.knowledge-and-resources"] },
      { name: "cards-tiles", instances: ["section.trade-expertise-highlights"] },
      { name: "section-promo", instances: ["div.homepage-flag:nth-of-type(2)"], section: "promo-bar" },
      { name: "section-cta", instances: ["section.c-triage-cta"], section: "accent" }
    ],
    sections: [
      { id: "rc1", name: "promo", selector: "div.homepage-flag:nth-of-type(2)", style: "promo-bar", blocks: [], defaultContent: ["div.homepage-flag:nth-of-type(2)"] },
      { id: "rc2", name: "hero", selector: "div.top-banner-comp", style: null, blocks: ["hero-edc"], defaultContent: [] },
      { id: "rc3", name: "support", selector: "div.knowledgeandresources:nth-of-type(2)", style: null, blocks: ["cards-edc-support"], defaultContent: ["div.knowledgeandresources:nth-of-type(2) div.heading-wrapper"] },
      { id: "rc4", name: "insights", selector: "div.export-trends", style: null, blocks: ["tabs-insights"], defaultContent: ["div.export-trends h2"] },
      { id: "rc5", name: "solutions", selector: "div.homepageproductcard", style: null, blocks: ["cards-solutions"], defaultContent: [] },
      { id: "rc6", name: "finder", selector: "section.c-triage-cta", style: "accent", blocks: ["cta-band"], defaultContent: [] },
      { id: "rc7", name: "resources", selector: "div.knowledgeandresources:nth-of-type(6)", style: null, blocks: ["cards-resources"], defaultContent: ["div.knowledgeandresources:nth-of-type(6) div.heading-wrapper"] },
      { id: "rc8", name: "tailored", selector: "section.trade-expertise-highlights", style: null, blocks: ["cards-tiles"], defaultContent: ["section.trade-expertise-highlights h2"] }
    ]
  };
  var parsers = {
    "hero-edc": parse,
    "cards-edc-support": parse2,
    "tabs-insights": parse3,
    "cards-solutions": parse4,
    "cta-band": parse5,
    "cards-resources": parse6,
    "cards-tiles": parse7
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
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.filter((blockDef) => !blockDef.name.startsWith("section-")).forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
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
  var import_edc_test_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
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
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath("/edc-test-page");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_edc_test_page_exports);
})();
