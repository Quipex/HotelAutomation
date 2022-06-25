const sanitizeHtmlDiamonds = (html?: string) => {
  if (!html) {
    return html;
  }
  return html
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;');
};

export { sanitizeHtmlDiamonds };
