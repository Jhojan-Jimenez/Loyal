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
  // 1. Try environment variables first
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

  // 2. Try loading from secrets file fallback on server
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

export function generateGoogleWalletSaveUrl(
  student: Student,
  config: StudioConfig
): { success: boolean; saveUrl?: string; error?: string } {
  const creds = getCredentials();
  if (!creds || !creds.privateKey) {
    return {
      success: false,
      error: 'Google Wallet API credentials are not configured.',
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loyal.jhojan.cloud';
  const issuerId = creds.issuerId;
  const classId = `${issuerId}.samyama_yoga_pass_v1`;
  const sanitizedToken = student.token.replace(/[^a-zA-Z0-9_-]/g, '_');
  const objectId = `${issuerId}.${sanitizedToken}`;

  // 1. Define LoyaltyClass (Template)
  const loyaltyClass = {
    id: classId,
    issuerName: config.studioName || 'Loyal Business Club',
    programName: 'Pase Digital de Fidelización',
    programLogo: {
      sourceUri: {
        uri: `${appUrl}/icon-512.png`,
      },
      contentDescription: {
        defaultValue: {
          language: 'es',
          value: 'Logo Loyal',
        },
      },
    },
    hexBackgroundColor: '#09090B',
    reviewStatus: 'UNDER_REVIEW',
  };

  // 2. Define LoyaltyObject (Individual Student Card)
  const loyaltyObject = {
    id: objectId,
    classId: classId,
    state: 'ACTIVE',
    accountName: student.name,
    accountId: student.id,
    loyaltyPoints: {
      label: 'Sellos Acumulados',
      balance: {
        string: `${student.stamps} de ${config.totalStampsRequired} sellos`,
      },
    },
    barcode: {
      type: 'QR_CODE',
      value: student.token,
      alternateText: student.token,
    },
    textModulesData: [
      {
        header: 'Premio al completar',
        body: config.currentRewardTitle,
        id: 'reward_module',
      },
      {
        header: 'Wi-Fi Clientes',
        body: `Red: ${config.wifiSsid} · Clave: ${config.wifiPassword}`,
        id: 'wifi_module',
      },
      {
        header: 'Ubicación Local',
        body: config.address,
        id: 'location_module',
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: `${appUrl}/card/${student.token}`,
          description: 'Ver Mi Tarjeta Web Interactiva',
          id: 'web_card_link',
        },
        {
          uri: `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}`,
          description: 'Contactar Establecimiento por WhatsApp',
          id: 'whatsapp_link',
        },
      ],
    },
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
 * Updates an existing Google Wallet pass over-the-air with real-time balance and push notification
 */
export async function updateGoogleWalletPass(
  token: string,
  stamps: number,
  totalRequired: number = 10,
  studentName?: string
): Promise<{ success: boolean; error?: string }> {
  const creds = getCredentials();
  if (!creds || !creds.privateKey) {
    return { success: false, error: 'Google Wallet credentials not configured' };
  }

  const sanitizedToken = token.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const objectId = `${creds.issuerId}.${sanitizedToken}`;

  try {
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
      console.warn('Failed to obtain Google OAuth token for Wallet update:', errText);
      return { success: false, error: 'OAuth failure' };
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

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
            label: 'Clases Asistidas',
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

