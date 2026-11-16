/**
 * Dynamic TOTP (Time-based One-Time Password) generator & validator for Loyal QR passes.
 * Rotates every 30 seconds to prevent unauthorized screenshot sharing / replay fraud.
 */

const TOTP_STEP_SECONDS = 30;
const SECRET_SALT = 'loyal_secure_pass_salt_2026';

// FNV-1a 32-bit fast deterministic hashing
function fnv1a(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

/**
 * Generates a 6-character alphanumeric TOTP token for a student token and time step.
 */
export function generateQrTotp(studentToken: string, stepOffset = 0): string {
  const timeStep = Math.floor(Date.now() / 1000 / TOTP_STEP_SECONDS) + stepOffset;
  const rawInput = `${studentToken.trim().toLowerCase()}:${timeStep}:${SECRET_SALT}`;
  const hash = fnv1a(rawInput);
  
  // Format as 6 hex characters uppercase
  const hex = (hash % 16777215).toString(16).padStart(6, '0').toUpperCase();
  return hex;
}

/**
 * Returns the current time step and seconds remaining in current window (0 to 30)
 */
export function getTotpSecondsRemaining(): number {
  const currentSeconds = Math.floor(Date.now() / 1000);
  const remaining = TOTP_STEP_SECONDS - (currentSeconds % TOTP_STEP_SECONDS);
  return remaining === 0 ? TOTP_STEP_SECONDS : remaining;
}

/**
 * Validates a scanned QR token against current, previous, and next time windows
 * (tolerant to +/- 30s network / device clock skew).
 */
export function validateQrTotp(
  studentToken: string,
  providedTotp: string | null | undefined
): { valid: boolean; reason?: string } {
  if (!providedTotp) {
    // If no TOTP query param provided (e.g. legacy static QR or manual ID search)
    return { valid: true };
  }

  const cleanProvided = providedTotp.trim().toUpperCase();

  // Test current step (0), past step (-1), and next step (+1)
  const steps = [0, -1, 1];
  for (const offset of steps) {
    const expected = generateQrTotp(studentToken, offset);
    if (expected === cleanProvided) {
      return { valid: true };
    }
  }

  return {
    valid: false,
    reason: 'Código QR expirado o inválido. El cliente debe mostrar su tarjeta digital en vivo en pantalla.',
  };
}
