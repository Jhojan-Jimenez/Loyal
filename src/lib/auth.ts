import { AuthSession, AuthRole } from './types';

export const AUTH_COOKIE_NAME = 'loyal_session';

// Secret for HMAC signing (fallback to a deterministic internal salt)
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SUPERADMIN_PASSWORD ||
  'loyal-super-secret-salt-2026-auth-gate';

// Master SuperAdmin password (configurable via env, default 'loyal2026')
export const SUPERADMIN_PASSWORD =
  process.env.SUPERADMIN_PASSWORD || 'loyal2026';

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64url');
  }
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString('utf8');
  }
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

async function getHmacKey(usage: 'sign' | 'verify') {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

export async function signSessionToken(session: AuthSession): Promise<string> {
  const enc = new TextEncoder();
  const payloadStr = JSON.stringify(session);
  const b64Payload = base64UrlEncode(payloadStr);

  const key = await getHmacKey('sign');
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(b64Payload)
  );

  let b64Sig = '';
  if (typeof Buffer !== 'undefined') {
    b64Sig = Buffer.from(signatureBuffer).toString('base64url');
  } else {
    const bytes = new Uint8Array(signatureBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    b64Sig = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  return `${b64Payload}.${b64Sig}`;
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [b64Payload, b64Sig] = parts;

    const enc = new TextEncoder();
    const key = await getHmacKey('verify');

    // Decode signature
    let sigBytes: BufferSource;
    if (typeof Buffer !== 'undefined') {
      const buf = Buffer.from(b64Sig, 'base64url');
      const ab = new ArrayBuffer(buf.length);
      const view = new Uint8Array(ab);
      for (let i = 0; i < buf.length; i++) view[i] = buf[i];
      sigBytes = view;
    } else {
      let base64 = b64Sig.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const binary = atob(base64);
      const view = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
      }
      sigBytes = view;
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(b64Payload)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(b64Payload);
    const session: AuthSession = JSON.parse(payloadJson);

    // Check expiration
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
