import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Student, StudioConfig } from './types';

interface GoogleWalletCredentials {
  issuerId: string;
  clientEmail: string;
  privateKey: string;
}

function getCredentials(): GoogleWalletCredentials | null {
  const envIssuer = process.env.GOOGLE_WALLET_ISSUER_ID;
  const envEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
  const envKey = process.env.GOOGLE_WALLET_PRIVATE_KEY;

  if (envIssuer && envEmail && envKey) {
    return {
      issuerId: envIssuer.trim(),
      clientEmail: envEmail.trim(),
      privateKey: envKey.replace(/\\n/g, '\n'),
    };
  }

  try {
    const secretsPath = path.join(process.cwd(), 'secrets', 'google-wallet-credentials.json');
    if (fs.existsSync(secretsPath)) {
      const fileData = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
      return {
        issuerId: envIssuer || '3388000000023224674',
        clientEmail: fileData.client_email,
        privateKey: fileData.private_key,
      };
    }
  } catch (err) {
    console.warn('Could not read google-wallet-credentials.json:', err);
  }

  return null;
}

function sanitizeIdPart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

export function getWalletIds(issuerId: string, token: string, tenantSlug?: string) {
  const cleanSlug = sanitizeIdPart(tenantSlug || 'default');
  const sanitizedToken = sanitizeIdPart(token);
  return {
    classId: `${issuerId}.loyal_${cleanSlug}_v1`,
    objectId: `${issuerId}.${cleanSlug}_${sanitizedToken}`,
  };
}

function resolvePublicImageUrl(url: string | undefined, appUrl: string): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('/')) {
    const base = appUrl.replace(/\/$/, '');
    return base.startsWith('https://') ? `${base}${trimmed}` : null;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' ? trimmed : null;
  } catch {
    return null;
  }
}

function buildLoyaltyClassPayload(classId: string, config: StudioConfig, appUrl: string) {
  const logoUri =
    resolvePublicImageUrl(config.walletLogoUrl, appUrl) || `${appUrl}/icon-512.png`;

  const bgColor = /^#[0-9A-Fa-f]{6}$/.test(config.walletBgColor || '')
    ? config.walletBgColor!
    : '#FAF7F2';

  const payload: Record<string, any> = {
    id: classId,
    issuerName: config.studioName || 'Loyal Business Club',
    programName: config.walletProgramName?.trim() || 'Pase Digital de Fidelización',
    programLogo: {
      sourceUri: { uri: logoUri },
      contentDescription: {
        defaultValue: {
          language: 'es',
          value: `Logo ${config.studioName || 'Loyal'}`,
        },
      },
    },
    hexBackgroundColor: bgColor,
    reviewStatus: 'UNDER_REVIEW',
  };

  // In Google Wallet, heroImage displays a wide visual image on the pass.
  // Use explicit walletHeroImageUrl if set, or fall back to walletBgImageUrl when image mode is active.
  const heroUri =
    resolvePublicImageUrl(config.walletHeroImageUrl, appUrl) ||
    (config.walletBgMode === 'image'
      ? resolvePublicImageUrl(config.walletBgImageUrl, appUrl)
      : null);

  if (heroUri) {
    payload.heroImage = {
      sourceUri: { uri: heroUri },
      contentDescription: {
        defaultValue: {
          language: 'es',
          value: config.studioName || 'Tarjeta de Fidelización',
        },
      },
    };
  }

  return payload;
}

async function getGoogleWalletAccessToken(creds: GoogleWalletCredentials): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    {
      iss: creds.clientEmail,
      scope: 'https://www.googleapis.com/auth/wallet_object.issuer',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    },
    creds.privateKey,
    { algorithm: 'RS256' }
  );

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.warn('Failed to obtain Google OAuth token for Wallet:', errText);
    return null;
  }

  const tokenData = await tokenRes.json();
  return tokenData.access_token || null;
}

export function generateGoogleWalletSaveUrl(
  student: Student,
  config: StudioConfig,
  tenantSlug?: string
): { success: boolean; saveUrl?: string; error?: string } {
  const creds = getCredentials();
  if (!creds || !creds.privateKey) {
    return {
      success: false,
      error: 'Google Wallet API credentials are not configured.',
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';
  const resolvedSlug = tenantSlug || student.tenantSlug || 'default';
  const { classId, objectId } = getWalletIds(creds.issuerId, student.token, resolvedSlug);

  // 1. Define LoyaltyClass (Template scoped strictly to this tenant)
  const loyaltyClass = buildLoyaltyClassPayload(classId, config, appUrl);

  // 2. Define LoyaltyObject (Individual Student Card scoped to tenant + student)
  const textModulesData: Array<{ header: string; body: string; id: string }> = [
    {
      header: 'Premio al completar',
      body: config.currentRewardTitle || 'Recompensa Especial',
      id: 'reward_module',
    },
  ];

  if (config.wifiSsid?.trim()) {
    textModulesData.push({
      header: 'Wi-Fi Clientes',
      body: config.wifiPassword?.trim()
        ? `Red: ${config.wifiSsid} · Clave: ${config.wifiPassword}`
        : `Red: ${config.wifiSsid}`,
      id: 'wifi_module',
    });
  }

  if (config.address?.trim()) {
    textModulesData.push({
      header: 'Ubicación Local',
      body: config.address,
      id: 'location_module',
    });
  }

  const uris: Array<{ uri: string; description: string; id: string }> = [
    {
      uri: `${appUrl}/card/${student.token}`,
      description: 'Ver Mi Tarjeta Web Interactiva',
      id: 'web_card_link',
    },
  ];

  const cleanWa = (config.whatsappNumber || '').replace(/\D/g, '');
  if (cleanWa.length >= 7) {
    uris.push({
      uri: `https://wa.me/${cleanWa}`,
      description: 'Contactar Establecimiento por WhatsApp',
      id: 'whatsapp_link',
    });
  }

  const loyaltyObject = {
    id: objectId,
    classId,
    state: 'ACTIVE',
    accountName: student.name,
    accountId: student.id,
    loyaltyPoints: {
      label: 'Sellos Acumulados',
      balance: {
        string: `${student.stamps} de ${config.totalStampsRequired || 10} sellos`,
      },
    },
    barcode: {
      type: 'QR_CODE',
      value: student.token,
      alternateText: student.token,
    },
    textModulesData,
    linksModuleData: { uris },
  };

  // 3. Claims payload for Fat JWT Save Link
  const claims = {
    iss: creds.clientEmail,
    aud: 'google',
    origins: [appUrl, 'http://localhost:3000', 'https://loyal.jhojan.cloud'],
    typ: 'savetowallet',
    payload: {
      loyaltyClasses: [loyaltyClass],
      loyaltyObjects: [loyaltyObject],
    },
  };

  try {
    const token = jwt.sign(claims, creds.privateKey, {
      algorithm: 'RS256',
    });

    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    return { success: true, saveUrl };
  } catch (err: any) {
    console.error('Failed to sign Google Wallet JWT:', err);
    return { success: false, error: err.message || 'Error signing JWT' };
  }
}

/**
 * Updates an existing Google Wallet pass over-the-air with real-time balance
 */
export async function updateGoogleWalletPass(
  token: string,
  stamps: number,
  totalRequired: number = 10,
  studentName?: string,
  tenantSlug?: string
): Promise<{ success: boolean; error?: string }> {
  const creds = getCredentials();
  if (!creds || !creds.privateKey) {
    return { success: false, error: 'Google Wallet credentials not configured' };
  }

  const { objectId } = getWalletIds(creds.issuerId, token, tenantSlug);

  try {
    const accessToken = await getGoogleWalletAccessToken(creds);
    if (!accessToken) {
      return { success: false, error: 'OAuth failure' };
    }

    const patchRes = await fetch(
      `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loyaltyPoints: {
            label: 'Sellos Acumulados',
            balance: {
              string: `${stamps} de ${totalRequired} sellos`,
            },
          },
        }),
      }
    );

    if (!patchRes.ok) {
      const errData = await patchRes.text();
      console.warn(`[Google Wallet] Patch status ${patchRes.status} for ${objectId}:`, errData);
      return { success: false, error: `Patch status ${patchRes.status}` };
    }

    console.log(`[Google Wallet] Successfully updated pass ${objectId} to ${stamps}/${totalRequired} stamps`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Google Wallet] Over-the-air update error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Syncs LoyaltyClass visual styling changes to Google Wallet REST API for a tenant
 */
export async function updateGoogleWalletClass(
  tenantSlug: string,
  config: StudioConfig
): Promise<{ success: boolean; error?: string }> {
  const creds = getCredentials();
  if (!creds || !creds.privateKey) {
    return { success: false, error: 'Google Wallet credentials not configured' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';
  const { classId } = getWalletIds(creds.issuerId, 'class', tenantSlug);
  const classPayload = buildLoyaltyClassPayload(classId, config, appUrl);

  try {
    const accessToken = await getGoogleWalletAccessToken(creds);
    if (!accessToken) {
      return { success: false, error: 'OAuth failure' };
    }

    const patchRes = await fetch(
      `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/${classId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classPayload),
      }
    );

    if (!patchRes.ok) {
      const errData = await patchRes.text();
      console.warn(`[Google Wallet] Class patch status ${patchRes.status} for ${classId}:`, errData);
      return { success: false, error: `Class patch status ${patchRes.status}` };
    }

    console.log(`[Google Wallet] Synced LoyaltyClass ${classId}`);
    return { success: true };
  } catch (err: any) {
    console.warn('[Google Wallet] Class sync error:', err.message);
    return { success: false, error: err.message };
  }
}
