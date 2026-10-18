// GDPR Art. 13 requires the controller's identity; set this before launch.
export const CONTROLLER_NAME: string | null = null;
export const CONTROLLER_COUNTRY = "Croatia";
export const PRIVACY_EMAIL = "privacy@thyratensor.com";

// Bump whenever the privacy policy changes; stored with each consent.
export const PRIVACY_VERSION = "2026-10-18";
export const PRIVACY_EFFECTIVE = "October 18, 2026";

export function controllerLabel(): string {
  return CONTROLLER_NAME ? `${CONTROLLER_NAME} (${CONTROLLER_COUNTRY})` : `the operator of thyratensor.com (${CONTROLLER_COUNTRY})`;
}
