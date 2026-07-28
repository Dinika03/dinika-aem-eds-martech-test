/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EDC (www.edc.ca) site-wide cleanup.
 *
 * EDC-specific companion to remarkable-cleanup.js and offer-page-cleanup.js.
 * EDC is a corporate AEM site rendered with .aem-Grid / .responsivegrid /
 * .cmp-* wrappers. This transformer strips the non-authorable site shell
 * (global header/nav, footer, cookie-consent, tracking/reCAPTCHA widgets,
 * and residual scripts/links) so the import contains only page-level
 * authorable content. In EDS the header and footer are auto-populated, so
 * they must not appear in the page body.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie-consent overlay and tracking/verification widgets. Removed before
    // block parsing so their nested content (policy text, buttons, iframes) can
    // never be matched into a block.
    // Verified in cleaned.html:
    //   <div id="onetrust-consent-sdk"> (line 3339) — wraps
    //     <div id="onetrust-banner-sdk"> (line 3342) and <div class="ot-sdk-container"> (line 3344).
    //   <div class="grecaptcha-badge"> (line 3620) — invisible reCAPTCHA badge
    //     with the reCAPTCHA iframe (line 3622).
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      'div.ot-sdk-container',
      'div.grecaptcha-badge',
    ]);

    // "Skip navigation" accessibility link — part of the site shell, not
    // authorable page content.
    // Verified in cleaned.html: <a href="#skip-to-main-content" id="skip-button"
    //   class="c-interaction-button ..."> (line 14).
    WebImporter.DOMUtils.remove(element, ['a#skip-button']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome. In EDS the header/nav and footer are
    // auto-populated, so they are stripped from the page body.
    // Verified in cleaned.html:
    //   <div class="header aem-GridColumn aem-GridColumn--default--12"> (line 5) —
    //     wraps <div class="cmp-headerv2 container"> (line 13) and
    //     <div class="headerv2 aem-GridColumn ..."> (line 11).
    //   <div class="footer aem-GridColumn aem-GridColumn--default--12"> (line 3066) —
    //     wraps <footer id="footerv2" class="full-width"> (line 3073),
    //     <div class="subscriptioncentre section"> (line 3074),
    //     <div class="categorylinks section"> (line 3124),
    //     <div class="footnotes section"> (line 3236).
    WebImporter.DOMUtils.remove(element, [
      'div.header.aem-GridColumn',
      'div.cmp-headerv2',
      'div.headerv2',
      'div.footer.aem-GridColumn',
      '#footerv2',
      'div.subscriptioncentre',
      'div.categorylinks',
      'div.footnotes',
    ]);

    // Residual non-authorable tracking iframes, injected clientlib stylesheet
    // links, scripts, and noscript fallbacks from the AEM template shell.
    // Verified in cleaned.html:
    //   <iframe class="ot-text-resize" ...> (line 3615),
    //   <iframe title="reCAPTCHA" ...> (line 3622),
    //   trailing <iframe> (line 3630),
    //   <link href="/etc.clientlibs/edc/clientlibs/clientlib-headerv2.min...css"> (line 12).
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
    ]);
  }
}
