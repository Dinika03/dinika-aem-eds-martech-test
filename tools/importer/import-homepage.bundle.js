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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-intro.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, [class*="title"]');
    const description = element.querySelector('.home-description1, span[class*="description"], p');
    const images = Array.from(element.querySelectorAll("img"));
    const ctaLinks = Array.from(element.querySelectorAll("a"));
    if (!heading && !description && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    images.forEach((img) => contentCell.push(img));
    ctaLinks.forEach((a) => contentCell.push(a));
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse2(element, { document }) {
    const heading = element.querySelector('.home-header2 h2, h2, [class*="text19"], [class*="header"] h2');
    const bodyParas = Array.from(element.querySelectorAll('.home-description2 p, [class*="description"] p'));
    const cta = element.querySelector('a.button, a[class*="navlink"], .home-content2 a');
    const image = element.querySelector('.home-image14 img, [class*="image14"] img, img');
    if (!heading && bodyParas.length === 0 && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (heading) leftCell.push(heading);
    bodyParas.forEach((p) => leftCell.push(p));
    if (cta) leftCell.push(cta);
    const rightCell = [];
    if (image) rightCell.push(image);
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-services.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".card"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const icon = card.querySelector("img");
      const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
      const text = card.querySelector('p, [class*="text"]');
      const textCell = [];
      if (heading) textCell.push(heading);
      if (text) textCell.push(text);
      cells.push([icon || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-services", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-testimonial.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".quote"));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const photo = card.querySelector("img");
      const quote = card.querySelector('p, [class*="quote"]');
      const author = card.querySelector('[class*="author"]');
      const textCell = [];
      if (quote) textCell.push(quote);
      if (author) textCell.push(author);
      cells.push([photo || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-partners.js
  function parse5(element, { document }) {
    const logoContainers = Array.from(element.querySelectorAll(".partner-container"));
    if (logoContainers.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    logoContainers.forEach((container) => {
      const logo = container.querySelector("img");
      if (!logo) return;
      cells.push([logo, ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-partners", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse6(element, { document }) {
    const articles = Array.from(element.querySelectorAll('[class*="home-section"]'));
    if (articles.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    articles.forEach((article) => {
      const heading = article.querySelector('h1, h2, h3, h4, [class*="header"] h3');
      const paras = Array.from(article.querySelectorAll('[class*="description"] p, p'));
      const cta = article.querySelector('a.button, a[class*="navlink"]');
      const ctaButton = article.querySelector("button");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      paras.forEach((p) => contentCell.push(p));
      if (cta) {
        contentCell.push(cta);
      } else if (ctaButton) {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = (ctaButton.textContent || "Read more").trim();
        contentCell.push(link);
      }
      cells.push([contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse7(element, { document }) {
    const images = Array.from(element.querySelectorAll("img"));
    if (images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const row = images.map((img) => img);
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/remarkable-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "div.home-partners-mobile",
        "div.home-gallery-mobile"
      ]);
      WebImporter.DOMUtils.remove(element, [".ifm-overlay"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.home-header1",
        "footer-wrapper",
        "footer.footer-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/remarkable-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
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

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Marketing homepage for the Remarkable small-business template: header/nav, hero, mission statements, improve/services sections, testimonials, partners logos, article cards, CTA banner, gallery, newsletter signup, and footer.",
    urls: [
      "https://remarketabletemplateaepdinika.netlify.app/"
    ],
    blocks: [
      { name: "hero-intro", instances: ["section.home-hero", "header.home-hero"] },
      { name: "columns-media", instances: ["section.home-improve div.home-tabs"] },
      { name: "cards-services", instances: ["section.home-services1 div.home-cards"] },
      { name: "cards-testimonial", instances: ["section.home-testimonials div.home-container2"] },
      { name: "cards-partners", instances: ["section.home-partners div.home-partners-desktop"] },
      { name: "cards-articles", instances: ["section.home-services2 div.home-sections"] },
      { name: "columns-gallery", instances: ["section.home-galleries div.home-gallery-desktop"] },
      { name: "section-testimonials", instances: ["section.home-testimonials"], section: "accent" },
      { name: "section-banner", instances: ["section.home-banner"], section: "accent" }
    ],
    sections: [
      { id: "rc2", name: "hero", selector: "section.home-hero", style: null, blocks: ["hero-intro"], defaultContent: [] },
      { id: "rc3", name: "mission1", selector: "section.home-mission1", style: null, blocks: [], defaultContent: ["section.home-mission1 h2.home-text15", "section.home-mission1 a.home-navlink4"] },
      { id: "rc4", name: "improve", selector: "section.home-improve", style: null, blocks: ["columns-media"], defaultContent: ["section.home-improve div.home-heading1"] },
      { id: "rc5", name: "services1", selector: "section.home-services1", style: null, blocks: ["cards-services"], defaultContent: ["section.home-services1 h2.home-text25"] },
      { id: "rc6", name: "testimonials", selector: "section.home-testimonials", style: "accent", blocks: ["cards-testimonial"], defaultContent: [] },
      { id: "rc7", name: "partners", selector: "section.home-partners", style: null, blocks: ["cards-partners"], defaultContent: ["section.home-partners div.home-content4"] },
      { id: "rc8", name: "services2", selector: "section.home-services2", style: null, blocks: ["cards-articles"], defaultContent: ["section.home-services2 div.home-heading2"] },
      { id: "rc9", name: "banner", selector: "section.home-banner", style: "accent", blocks: [], defaultContent: ["section.home-banner div.home-container5"] },
      { id: "rc10", name: "mission2", selector: "section.home-mission2", style: null, blocks: [], defaultContent: ["section.home-mission2 div.home-content5"] },
      { id: "rc11", name: "galleries", selector: "section.home-galleries", style: null, blocks: ["columns-gallery"], defaultContent: [] },
      { id: "rc12", name: "mission3", selector: "section.home-mission3", style: null, blocks: [], defaultContent: ["section.home-mission3 div.home-content6"] },
      { id: "rc13", name: "newsletter", selector: "section.home-newsletter", style: null, blocks: [], defaultContent: ["section.home-newsletter div.home-header8", "section.home-newsletter div.home-content7"] }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "columns-media": parse2,
    "cards-services": parse3,
    "cards-testimonial": parse4,
    "cards-partners": parse5,
    "cards-articles": parse6,
    "columns-gallery": parse7
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
  var import_homepage_default = {
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
      const OVERSIZED_SVG_MAP = {
        "group 2106.svg": "/content/images/gallery-accent-2106.svg",
        "group%202106.svg": "/content/images/gallery-accent-2106.svg"
      };
      main.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src") || "";
        const key = Object.keys(OVERSIZED_SVG_MAP).find((k) => src.includes(k));
        if (key) img.src = OVERSIZED_SVG_MAP[key];
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
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
  return __toCommonJS(import_homepage_exports);
})();
