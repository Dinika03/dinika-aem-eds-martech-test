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

  // tools/importer/import-our-offer-page.js
  var import_our_offer_page_exports = {};
  __export(import_our_offer_page_exports, {
    default: () => import_our_offer_page_default
  });

  // tools/importer/parsers/offer-hero-intro.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .hero17-text1, [class*="text1"]');
    const description = element.querySelector('.hero17-text2, p[class*="text2"], p');
    const actionButtons = Array.from(element.querySelectorAll(".hero17-actions button"));
    const ctas = actionButtons.map((btn) => {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = (btn.textContent || "").trim();
      return a;
    }).filter((a) => a.textContent);
    const images = Array.from(element.querySelectorAll("img"));
    if (!heading && !description && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctas.forEach((a) => contentCell.push(a));
    images.forEach((img) => contentCell.push(img));
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/offer-cards-services.js
  function parse2(element, { document }) {
    const images = Array.from(element.querySelectorAll('[class*="image-container"] img'));
    const contents = Array.from(element.querySelectorAll('[class*="-content1"], [class*="-content2"], [class*="-content3"]'));
    if (images.length === 0 && contents.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const cardCount = Math.max(images.length, contents.length);
    for (let i = 0; i < cardCount; i += 1) {
      const image = images[i];
      const content = contents[i];
      const textCell = [];
      if (content) {
        const heading = content.querySelector('h1, h2, h3, h4, [class*="heading"]');
        const desc = content.querySelector(':scope > span[class*="body"], :scope > span, :scope > p');
        if (heading) textCell.push(heading);
        if (desc && desc !== heading) textCell.push(desc);
      }
      cells.push([image || "", textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-services", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/offer-cards-pricing.js
  function parse3(element, { document }) {
    const planCards = Array.from(element.querySelectorAll('[class*="pricing14-column1"], [class*="pricing14-column2"], [class*="pricing14-column3"]'));
    if (planCards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    planCards.forEach((card) => {
      const contentCell = [];
      const priceGroups = Array.from(card.querySelectorAll('[class*="pricing14-price1"]'));
      const priceWrapper = priceGroups.find((g) => !g.querySelector('[class*="pricing14-price1"]')) || card;
      Array.from(priceWrapper.querySelectorAll(":scope > p, :scope > h2, :scope > h3")).forEach((el) => {
        contentCell.push(el);
      });
      const featureItems = Array.from(card.querySelectorAll('[class*="pricing14-list-item"]'));
      if (featureItems.length) {
        const ul = document.createElement("ul");
        featureItems.forEach((item) => {
          const label = item.querySelector('span[class*="body"], span');
          const li = document.createElement("li");
          li.textContent = (label ? label.textContent : item.textContent || "").trim();
          if (li.textContent) ul.append(li);
        });
        if (ul.children.length) contentCell.push(ul);
      }
      const ctaBtn = card.querySelector("button");
      if (ctaBtn) {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = (ctaBtn.textContent || "").trim();
        if (a.textContent) contentCell.push(a);
      }
      cells.push([contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/offer-columns-steps.js
  function parse4(element, { document }) {
    const header = element.querySelector('[class*="section-header"]');
    const stepsContainer = element.querySelector('[class*="steps2-container3"]');
    if (!header && !stepsContainer) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (header) {
      const heading = header.querySelector('h1, h2, h3, [class*="heading"]');
      const paras = Array.from(header.querySelectorAll('p, [class*="body-large"]'));
      if (heading) leftCell.push(heading);
      paras.forEach((p) => leftCell.push(p));
      const ctaBtn = header.querySelector("button");
      if (ctaBtn) {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = (ctaBtn.textContent || "").trim();
        if (a.textContent) leftCell.push(a);
      }
    }
    const rightCell = [];
    if (stepsContainer) {
      const stepCards = Array.from(stepsContainer.querySelectorAll('[class*="thq-card"], [class*="steps2-container4"], [class*="steps2-container5"], [class*="steps2-container6"], [class*="steps2-container7"]'));
      const seen = /* @__PURE__ */ new Set();
      stepCards.forEach((cardEl) => {
        if (seen.has(cardEl)) return;
        seen.add(cardEl);
        const num = cardEl.querySelector('label, [class*="heading-3"]');
        const title = cardEl.querySelector('h1, h2, h3, [class*="heading-2"]');
        const desc = cardEl.querySelector('span[class*="body"], span, p');
        if (num && num.textContent.trim()) {
          const numP = document.createElement("p");
          numP.textContent = num.textContent.trim();
          rightCell.push(numP);
        }
        if (title) rightCell.push(title);
        if (desc) rightCell.push(desc);
      });
    }
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/offer-cards-testimonial.js
  function parse5(element, { document }) {
    const cards = Array.from(element.querySelectorAll('[class*="testimonial17-card"]'));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const photo = card.querySelector("img");
      const name = card.querySelector("strong");
      const role = card.querySelector('[class*="container1"] span[class*="body-small"], [class*="container1"] > span');
      const quote = card.querySelector('span[class*="testimonial17-text"]');
      const textCell = [];
      if (name) textCell.push(name);
      if (role && role !== name) textCell.push(role);
      if (quote) textCell.push(quote);
      cells.push([photo || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/offer-cards-contact.js
  function parse6(element, { document }) {
    const cards = Array.from(element.querySelectorAll('[class*="contact10-container2"], [class*="contact10-container4"]'));
    if (cards.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const title = card.querySelector('h1, h2, h3, [class*="heading"]');
      const address = card.querySelector('p, [class*="body-large"]');
      const cta = card.querySelector("a");
      const textCell = [];
      if (title) textCell.push(title);
      if (address) textCell.push(address);
      if (cta) textCell.push(cta);
      cells.push([image || "", textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/offer-page-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["div.our-offer-page-mobile-menu"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.our-offer-page-header",
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

  // tools/importer/transformers/offer-page-sections.js
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

  // tools/importer/import-our-offer-page.js
  var PAGE_TEMPLATE = {
    name: "our-offer-page",
    description: "Offers/pricing landing page: hero with image collage, feature lists, CTA banners, pricing plans, steps/process, testimonials grid, and contact cards.",
    urls: [
      "https://remarketabletemplateaepdinika.netlify.app/our-offer-page"
    ],
    blocks: [
      { name: "hero-intro", instances: ["hero17-wrapper"] },
      { name: "cards-services", instances: ["features24-wrapper", "features25-wrapper"] },
      { name: "cards-pricing", instances: ["a.our-offer-page-navlink4"] },
      { name: "columns-steps", instances: ["steps2-wrapper"] },
      { name: "cards-testimonial", instances: ["testimonial17-wrapper"] },
      { name: "cards-contact", instances: ["contact10-wrapper"] },
      { name: "section-cta", instances: ["a.our-offer-page-navlink3"], section: "accent" },
      { name: "section-testimonials", instances: ["testimonial17-wrapper"], section: "accent" }
    ],
    sections: [
      { id: "rc1", name: "hero", selector: "hero17-wrapper", style: null, blocks: ["hero-intro"], defaultContent: [] },
      { id: "rc2", name: "features1", selector: "features24-wrapper", style: null, blocks: ["cards-services"], defaultContent: [] },
      { id: "rc3", name: "cta", selector: "a.our-offer-page-navlink3", style: "accent", blocks: [], defaultContent: ["a.our-offer-page-navlink3"] },
      { id: "rc4", name: "features2", selector: "features25-wrapper", style: null, blocks: ["cards-services"], defaultContent: [] },
      { id: "rc5", name: "pricing", selector: "a.our-offer-page-navlink4", style: null, blocks: ["cards-pricing"], defaultContent: [] },
      { id: "rc6", name: "steps", selector: "steps2-wrapper", style: null, blocks: ["columns-steps"], defaultContent: [] },
      { id: "rc7", name: "testimonials", selector: "testimonial17-wrapper", style: "accent", blocks: ["cards-testimonial"], defaultContent: [] },
      { id: "rc8", name: "contact", selector: "contact10-wrapper", style: null, blocks: ["cards-contact"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero-intro": parse,
    "cards-services": parse2,
    "cards-pricing": parse3,
    "columns-steps": parse4,
    "cards-testimonial": parse5,
    "cards-contact": parse6
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
  var import_our_offer_page_default = {
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
  return __toCommonJS(import_our_offer_page_exports);
})();
