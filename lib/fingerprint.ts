import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedFingerprint: string | null = null;

export const getFingerprint = async (): Promise<string> => {
  // Return cached fingerprint if available
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  try {
    // Load the FingerprintJS library
    const fp = await FingerprintJS.load();

    // Get the visitor identifier
    const result = await fp.get();

    // Cache the fingerprint
    cachedFingerprint = result.visitorId;
    return result.visitorId;
  } catch (error) {
    console.error('Error generating fingerprint:', error);
    // Fallback to a random string if fingerprint generation fails
    const fallbackFingerprint = Math.random().toString(36).substring(2);
    cachedFingerprint = fallbackFingerprint;
    return fallbackFingerprint;
  }
};
