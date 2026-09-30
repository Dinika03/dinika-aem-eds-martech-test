/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EDC credit-insurance page cleanup
 * (https://www.edc.ca/en/solutions/insurance/credit-insurance.html,
 * template edc-credit-insurance).
 *
 * Strips the non-authorable EDC site shell (global header/mega-nav, footer,
 * cookie consent, reCAPTCHA, page-level feedback, skip links, scripts) and the
 * hidden later steps of the gated lead-gen form. In afterTransform it rewrites
 * every remaining body link to "/" (EDS site homepage) except mailto:, tel:
 * and pure in-page "#..." anchors.
 *
 * All selectors verified against migration-work/cleaned.html (line numbers
 * refer to the whitespace-stripped file).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Section transformer marker attribute — must survive attribute cleanup.
const SECTION_MARKER_ATTR = 'data-excat-section-id';

// Tracking / AEM component data attributes to strip.
const TRACKING_ATTR_RE = /^(data-(cmp|track|tracking|analytics|layer|gtm|adobe|link|component)|on[a-z]+$)/i;

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent + reCAPTCHA widgets.
    //   <div id="onetrust-consent-sdk"> (line 3371), <div id="onetrust-banner-sdk"> (3374),
    //   <div id="onetrust-pc-sdk"> (3401), <div class="grecaptcha-badge"> (3652, 3664),
    //   <iframe title="reCAPTCHA"> / <iframe class="ot-text-resize">.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      'div.grecaptcha-badge',
      'iframe[title="reCAPTCHA"]',
      'iframe.ot-text-resize',
    ]);

    // Global header / mega-nav (removed before parsing so nav markup can never
    // match block selectors). DO NOT touch header.c-l2-header (hero block,
    // inside div.l2header — line 2580/2582).
    //   <div class="header aem-GridColumn ..."> (line 5) wraps
    //   <div class="headerv2 ..."> (11) and <div class="cmp-headerv2 container"> (13).
    //   <a href="#skip-to-main-content" id="skip-button"> (14), <div id="skip-to-main-content"> (2570).
    WebImporter.DOMUtils.remove(element, [
      'div.header.aem-GridColumn',
      'div.headerv2',
      'div.cmp-headerv2',
      'a#skip-button',
      '#skip-to-main-content',
    ]);
    // Any other <header> that is not the hero (none on the captured page; safety net).
    element.querySelectorAll('header').forEach((h) => {
      if (!h.classList.contains('c-l2-header')) h.remove();
    });

    // Global footer.
    //   <div class="footer aem-GridColumn ..."> (line 3098) wraps <footer id="footerv2"> (3105).
    WebImporter.DOMUtils.remove(element, [
      'div.footer.aem-GridColumn',
      '#footerv2',
    ]);

    // Page-level feedback widget and its grid wrapper.
    //   <div class="responsivegrid homepage-flag ..."> (line 3082) >
    //   <div class="pagelevelfeedback ..."> (3084) > <div id="idPageLevelFeedback"> (3087).
    WebImporter.DOMUtils.remove(element, [
      'div.pagelevelfeedback',
      'div.responsivegrid.homepage-flag',
    ]);

    // Hidden steps / states of the gated lead-gen form (section.c-gated-lead-gen-form,
    // line 2754). Only the visible email step (form.email-section) is authorable.
    //   <form class="form-section hide"> (2784) — name/company/annual-sales step,
    //   <div class="thanks-section hide"> (2880), <div class="submit-failed-message hide"> (2887),
    //   <div class="c-processing-screen"> (2892).
    const leadGen = element.querySelector('section.c-gated-lead-gen-form');
    if (leadGen) {
      leadGen.querySelectorAll('form.form-section.hide, div.thanks-section.hide, div.submit-failed-message.hide')
        .forEach((el) => el.remove());
      const processing = leadGen.querySelector('div.c-processing-screen');
      if (processing) {
        const wrapper = processing.parentElement;
        if (wrapper && wrapper !== leadGen && wrapper.children.length === 1) wrapper.remove();
        else processing.remove();
      }
    }

    // Scripts, styles, stylesheet links, noscript fallbacks.
    WebImporter.DOMUtils.remove(element, ['script', 'style', 'link', 'noscript']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Safety net for anything re-exposed after parsing.
    WebImporter.DOMUtils.remove(element, [
      'div.header.aem-GridColumn',
      'div.footer.aem-GridColumn',
      '#footerv2',
      '#onetrust-consent-sdk',
      'div.grecaptcha-badge',
      'div.pagelevelfeedback',
      'iframe',
      'script',
      'style',
      'link',
      'noscript',
    ]);

    // REQUIREMENT: rewrite every remaining link to the EDS site homepage "/"
    // (relative, so it resolves to aem.page on preview and aem.live on live),
    // except mailto:, tel: and pure in-page "#..." anchors.
    element.querySelectorAll('a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').trim();
      if (/^(mailto:|tel:)/i.test(href)) return;
      if (href.startsWith('#') && href.length > 1) return;
      a.setAttribute('href', '/');
    });

    // Strip tracking / component data attributes (keep the section marker).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach(({ name }) => {
        if (name === SECTION_MARKER_ATTR) return;
        if (TRACKING_ATTR_RE.test(name)) el.removeAttribute(name);
      });
    });

    // Remove leftover empty wrappers (no text and no media / tables / breaks),
    // deepest first. Never touch table structure or section markers.
    const KEEP = 'img, picture, video, table, hr, br, svg, input, select, textarea, button, a';
    [...element.querySelectorAll('div, span')].reverse().forEach((el) => {
      if (el.closest('table')) return;
      if (el.hasAttribute(SECTION_MARKER_ATTR)) return;
      if (el.textContent.trim() !== '') return;
      if (el.querySelector(KEEP)) return;
      el.remove();
    });
  }
}
