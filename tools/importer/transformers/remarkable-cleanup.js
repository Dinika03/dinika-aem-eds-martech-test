/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Remarkable (remarketabletemplateaepdinika.netlify.app) site-wide cleanup.
 *
 * Removes non-authorable site chrome and duplicate mobile-variant markup so the
 * import contains only page-level authorable content. All selectors below were
 * verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Duplicate mobile-variant markup — the desktop variants are the ones
    // referenced in the block mappings (cards-partners, columns-gallery).
    // Removing the mobile duplicates before block parsing prevents content
    // from being imported twice.
    // Verified in cleaned.html: <div class="home-partners-mobile"> (line 366),
    // <div class="home-gallery-mobile"> (line 593).
    WebImporter.DOMUtils.remove(element, [
      'div.home-partners-mobile',
      'div.home-gallery-mobile',
    ]);

    // Iframe loader modal overlay injected by the template shell (not authorable).
    // Verified in cleaned.html: <div class="ifm-overlay"> (line 735).
    WebImporter.DOMUtils.remove(element, ['.ifm-overlay']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome. In EDS the header/nav and footer are
    // auto-populated, so they must be stripped from the page body.
    // Verified in cleaned.html:
    //   <header class="home-header1"> (line 6) — contains desktop nav + burger + mobile menu
    //   <footer-wrapper class="footer-wrapper"> / <footer class="footer-footer"> (lines 645-728)
    //     — Remarkable logo, contact details, copyright, nav links, social links.
    // The newsletter signup (section.home-newsletter) is real content and is NOT removed.
    WebImporter.DOMUtils.remove(element, [
      'header.home-header1',
      'footer-wrapper',
      'footer.footer-footer',
    ]);

    // Adobe/demdex ID-syncing tracking iframe + any residual iframes/links/noscript.
    // Verified in cleaned.html: <iframe ... class="aamIframeLoaded"
    //   id="destination_publishing_iframe_accenture-partner_0"> (line 742),
    //   <link href="./style.css"> / <link href="./index.css"> (lines 2, 4).
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
    ]);
  }
}
