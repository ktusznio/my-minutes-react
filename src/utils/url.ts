export const currentBaseUrl = (): string =>
  window.location.href.substring(0, window.location.href.indexOf(window.location.pathname))
