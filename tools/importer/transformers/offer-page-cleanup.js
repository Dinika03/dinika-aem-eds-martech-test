/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: our-offer-page (remarketabletemplateaepdinika.netlify.app) site-wide cleanup.
 *
 * Offer-page-specific companion to remarkable-cleanup.js (homepage). Removes
 * non-authorable site chrome and duplicate mobile-only markup so the import
 * contains only page-level authorable content. All selectors below were
 * verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Duplicate mobile-only navigation markup nested inside the header.
    // In EDS the header/nav is auto-populated, and this mobile menu is a
    // duplicate of the desktop nav — removing it before block parsing prevents
    // its content (Remarkable branding, nav buttons, social icons) from being
    // imported.
    // Verified in cleaned.html: <div class="our-offer-page-mobile-menu"> (line 33).
    WebImporter.DOMUtils.remove(element, ['div.our-offer-page-mobile-menu']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome. In EDS the header/nav and footer are
    // auto-populated, so they must be stripped from the page body.
    // Verified in cleaned.html:
    //   <header class="our-offer-page-header"> (line 6) — wraps the inner
    //     <header class="our-offer-page-navbar-interactive"> (line 7) with the
    //     desktop menu, burger, and (already-removed) mobile menu.
    //   <footer-wrapper class="footer-wrapper"> (line 1201) /
    //     <footer class="footer-footer"> (line 1203) — Remarkable logo, contact
    //     details, copyright, nav links, social links.
    WebImporter.DOMUtils.remove(element, [
      'header.our-offer-page-header',
      'footer-wrapper',
      'footer.footer-footer',
    ]);

    // Adobe/demdex ID-syncing tracking iframe + residual stylesheet links and
    // scripts injected by the template shell (not authorable).
    // Verified in cleaned.html: <iframe ... class="aamIframeLoaded"
    //   id="destination_publishing_iframe_accenture-partner_0"> (line 1287),
    //   <link href="./style.css"> (line 2), <link href="./our-offer-page.css"> (line 4).
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
    ]);
  }
}
