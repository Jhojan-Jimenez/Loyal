import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'loyal-vitest-'));
process.env.DATA_DIR = tempDir;

// Dynamic imports after DATA_DIR is configured so server-db uses the isolated temp directory.
const serverDb = await import('@/lib/server-db');
const auth = await import('@/lib/auth');
const loginRoute = await import('@/app/api/auth/login/route');
const dbRoute = await import('@/app/api/db/route');
const configRoute = await import('@/app/api/admin/config/route');
const switchRoleRoute = await import('@/app/api/dev/switch-role/route');
const deleteStudentRoute = await import('@/app/api/students/delete/route');
const cashiersRoute = await import('@/app/api/admin/cashiers/route');
const pinRoute = await import('@/app/api/auth/pin/route');
const stampRoute = await import('@/app/api/students/stamp/route');

describe('Loyal Multi-Tenant SaaS Corner Cases', () => {
  let tenantAUserEmail = 'owner-a@test.local';
  let tenantBUserEmail = 'owner-b@test.local';
  const password = 'Password123!';

  beforeAll(() => {
    // Seed two tenants via onboarding flow
    const linkA = serverDb.createBlankOnboardingLinkServer({ plan: 'pro' });
    const resA = serverDb.completeSelfOnboardingServer({
      token: linkA.onboardingToken.token,
      businessName: 'Cafe Alfa',
      ownerName: 'Ana Alfa',
      ownerPhone: '3001112233',
      ownerEmail: tenantAUserEmail,
      password,
    });
    expect(resA.success).toBe(true);

    const linkB = serverDb.createBlankOnboardingLinkServer({ plan: 'pro' });
    const resB = serverDb.completeSelfOnboardingServer({
      token: linkB.onboardingToken.token,
      businessName: 'Barber Beta',
      ownerName: 'Beto Beta',
      ownerPhone: '3004445566',
      ownerEmail: tenantBUserEmail,
      password,
    });
    expect(resB.success).toBe(true);
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('persists onboardingTokens across disk reads (getDbData / loadDb)', () => {
    const link = serverDb.createBlankOnboardingLinkServer({ plan: 'starter' });
    const verified = serverDb.verifyOnboardingTokenServer(link.onboardingToken.token);
    expect(verified.valid).toBe(true);
  });

  it('blocks reserved or duplicate slugs and protects SuperAdmin email during onboarding', () => {
    expect(() =>
      serverDb.createTenantServer({
        name: 'Admin Hack',
        slug: 'superadmin',
        ownerName: 'Hacker',
        ownerEmail: 'hacker@test.local',
        ownerPhone: '3000000001',
      })
    ).toThrow();

    expect(() =>
      serverDb.createTenantServer({
        name: 'Cafe Alfa Clone',
        slug: 'cafe-alfa',
        ownerName: 'Clone',
        ownerEmail: 'clone@test.local',
        ownerPhone: '3000000002',
      })
    ).toThrow();

    const link = serverDb.createBlankOnboardingLinkServer({});
    const superAdminTakeover = serverDb.completeSelfOnboardingServer({
      token: link.onboardingToken.token,
      businessName: 'Takeover',
      ownerName: 'Evil',
      ownerPhone: '3000000003',
      ownerEmail: 'jhojanjimene@gmail.com',
      password,
    });
    expect(superAdminTakeover.success).toBe(false);
  });

  it('does not leak sensitive fields in public GET /api/db', async () => {
    const req = new NextRequest('http://localhost:3000/api/db?slug=cafe-alfa');
    const res = await dbRoute.GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.users).toBeUndefined();
    expect(body.memberships).toBeUndefined();
    expect(body.invitations).toBeUndefined();
    expect(body.onboardingTokens).toBeUndefined();
    expect(body.config?.adminPin).toBeUndefined();
    expect(body.config?.cashierPin).toBeUndefined();
    expect(body.tenant?.config?.adminPin).toBeUndefined();
    expect(body.tenant?.config?.cashierPin).toBeUndefined();
  });

  it('rejects unauthenticated mutations on /api/admin/config, /api/dev/switch-role, and /api/students/delete', async () => {
    const cfgReq = new NextRequest('http://localhost:3000/api/admin/config', {
      method: 'POST',
      body: JSON.stringify({ tenantSlug: 'cafe-alfa', totalStampsRequired: 5 }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect((await configRoute.POST(cfgReq)).status).toBe(401);

    const roleReq = new NextRequest('http://localhost:3000/api/dev/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role: 'superadmin' }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect((await switchRoleRoute.POST(roleReq)).status).toBe(403);

    const delReq = new NextRequest('http://localhost:3000/api/students/delete', {
      method: 'POST',
      body: JSON.stringify({ token: 'fake-token' }),
      headers: { 'Content-Type': 'application/json' },
    });
    expect((await deleteStudentRoute.POST(delReq)).status).toBe(401);
  });

  it('prevents cross-tenant config mutation and validates totalStampsRequired & hex color', async () => {
    const userB = serverDb.findUserByEmail(tenantBUserEmail)!;
    const tenantB = serverDb.getTenantBySlug('barber-beta')!;
    const tokenB = await auth.signSessionToken({
      userId: userB.id,
      email: userB.email,
      fullName: userB.fullName,
      isPlatformSuperAdmin: false,
      expiresAt: Date.now() + 3600_000,
      activeTenant: { id: tenantB.id, slug: 'barber-beta', name: 'Barber Beta', role: 'OWNER' },
    });

    const crossReq = new NextRequest('http://localhost:3000/api/admin/config', {
      method: 'POST',
      body: JSON.stringify({ tenantSlug: 'cafe-alfa', config: { studioName: 'Hacked' } }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${auth.AUTH_COOKIE_NAME}=${tokenB}`,
      },
    });
    expect((await configRoute.POST(crossReq)).status).toBe(403);

    const badColorReq = new NextRequest('http://localhost:3000/api/admin/config', {
      method: 'POST',
      body: JSON.stringify({ tenantSlug: 'barber-beta', config: { walletBgColor: 'not-a-hex' } }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${auth.AUTH_COOKIE_NAME}=${tokenB}`,
      },
    });
    expect((await configRoute.POST(badColorReq)).status).toBe(400);
  });

  it('blocks cross-tenant stamping, premature reward redemption, and suspended tenant registration', () => {
    const studentA = serverDb.registerStudentServer(
      'Cliente Uno',
      '3001112233',
      'c1@test.local',
      undefined,
      'cafe-alfa'
    );

    const crossStamp = serverDb.addStampServer(
      studentA.token,
      'Visita',
      'Caja',
      'barber-beta'
    );
    expect(crossStamp.success).toBe(false);

    const prematureRedeem = serverDb.redeemRewardServer(
      studentA.token,
      'Premio',
      'Caja',
      'cafe-alfa'
    );
    expect(prematureRedeem.success).toBe(false);

    const tenantA = serverDb.getTenantBySlug('cafe-alfa')!;
    const validPin = tenantA.config?.cashierPin || '0000';
    expect(serverDb.verifyCashierPinServer('cafe-alfa', validPin)).toBe(true);

    serverDb.updateTenantStatusServer('cafe-alfa', 'suspended');
    expect(serverDb.verifyCashierPinServer('cafe-alfa', validPin)).toBe(false);
    expect(() =>
      serverDb.registerStudentServer('Cliente Dos', '3009998877', undefined, undefined, 'cafe-alfa')
    ).toThrow();

    // Restore active for subsequent tests
    serverDb.updateTenantStatusServer('cafe-alfa', 'active');
  });

  it('supports per-cashier PINs, blocks duplicate/paused PINs, and attributes stamps to the cashier', async () => {
    const userB = serverDb.findUserByEmail(tenantBUserEmail)!;
    const tenantB = serverDb.getTenantBySlug('barber-beta')!;
    const tokenB = await auth.signSessionToken({
      userId: userB.id,
      email: userB.email,
      fullName: userB.fullName,
      isPlatformSuperAdmin: false,
      expiresAt: Date.now() + 3600_000,
      activeTenant: { id: tenantB.id, slug: 'barber-beta', name: 'Barber Beta', role: 'OWNER' },
    });

    // 1. Create cashier "María Gómez" with PIN 4321
    const createRes = await cashiersRoute.POST(
      new NextRequest('http://localhost:3000/api/admin/cashiers', {
        method: 'POST',
        body: JSON.stringify({ tenantSlug: 'barber-beta', name: 'María Gómez', pin: '4321' }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${auth.AUTH_COOKIE_NAME}=${tokenB}`,
        },
      })
    );
    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.cashier.name).toBe('María Gómez');

    // 2. Duplicate PIN in same tenant is rejected (400)
    const dupRes = await cashiersRoute.POST(
      new NextRequest('http://localhost:3000/api/admin/cashiers', {
        method: 'POST',
        body: JSON.stringify({ tenantSlug: 'barber-beta', name: 'Otro Cajero', pin: '4321' }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${auth.AUTH_COOKIE_NAME}=${tokenB}`,
        },
      })
    );
    expect(dupRes.status).toBe(400);

    // 3. Default '0000' no longer unlocks once custom cashiers exist
    const fallbackPinRes = await pinRoute.POST(
      new NextRequest('http://localhost:3000/api/auth/pin', {
        method: 'POST',
        body: JSON.stringify({ slug: 'barber-beta', pin: '0000' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(fallbackPinRes.status).toBe(401);

    // 4. Cashier PIN 4321 unlocks and sets cashier cookie with cashier's name
    const pinRes = await pinRoute.POST(
      new NextRequest('http://localhost:3000/api/auth/pin', {
        method: 'POST',
        body: JSON.stringify({ slug: 'barber-beta', pin: '4321' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(pinRes.status).toBe(200);
    const pinJson = await pinRes.json();
    expect(pinJson.cashierName).toBe('María Gómez');
    const cashierCookie = pinRes.cookies.get(auth.CASHIER_COOKIE_NAME)?.value;
    expect(cashierCookie).toBeTruthy();

    // 5. Stamping attributes transaction to "María Gómez" (ignoring client-spoofed cashierName)
    const studentB = serverDb.registerStudentServer(
      'Cliente Beta',
      '3007778899',
      undefined,
      undefined,
      'barber-beta'
    );
    const stampRes = await stampRoute.POST(
      new NextRequest('http://localhost:3000/api/students/stamp', {
        method: 'POST',
        body: JSON.stringify({
          token: studentB.token,
          note: 'Corte',
          cashierName: 'Impostor',
          tenantSlug: 'barber-beta',
        }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${auth.CASHIER_COOKIE_NAME}=${cashierCookie}`,
        },
      })
    );
    expect(stampRes.status).toBe(200);
    const stampJson = await stampRes.json();
    expect(stampJson.transaction.cashierName).toBe('María Gómez');

    // 6. Paused cashier cannot unlock
    const pauseRes = await cashiersRoute.PATCH(
      new NextRequest('http://localhost:3000/api/admin/cashiers', {
        method: 'PATCH',
        body: JSON.stringify({
          tenantSlug: 'barber-beta',
          cashierId: created.cashier.id,
          active: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Cookie: `${auth.AUTH_COOKIE_NAME}=${tokenB}`,
        },
      })
    );
    expect(pauseRes.status).toBe(200);

    const pausedPinRes = await pinRoute.POST(
      new NextRequest('http://localhost:3000/api/auth/pin', {
        method: 'POST',
        body: JSON.stringify({ slug: 'barber-beta', pin: '4321' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(pausedPinRes.status).toBe(401);
  });

  it('denies login with HTTP 403 when tenant is suspended or deleted and cleans up orphan data', async () => {
    // 1. Suspended tenant login -> 403 + no session cookie
    serverDb.updateTenantStatusServer('cafe-alfa', 'suspended');
    const suspLoginReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: tenantAUserEmail, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const suspRes = await loginRoute.POST(suspLoginReq);
    expect(suspRes.status).toBe(403);
    expect(suspRes.cookies.get(auth.AUTH_COOKIE_NAME)).toBeUndefined();

    // 2. Existing session against suspended tenant is rejected by validateSessionAgainstDb
    const userA = serverDb.findUserByEmail(tenantAUserEmail)!;
    const tenantA = serverDb.getTenantBySlug('cafe-alfa')!;
    const suspCheck = serverDb.validateSessionAgainstDb({
      userId: userA.id,
      email: userA.email,
      fullName: userA.fullName,
      isPlatformSuperAdmin: false,
      expiresAt: Date.now() + 3600_000,
      activeTenant: { id: tenantA.id, slug: 'cafe-alfa', name: 'Cafe Alfa', role: 'OWNER' },
    });
    expect(suspCheck.valid).toBe(false);

    // 3. Delete tenant -> cascades students, memberships, and orphan non-superadmin user
    expect(serverDb.deleteTenantServer('cafe-alfa')).toBe(true);
    expect(serverDb.getTenantBySlug('cafe-alfa')).toBeUndefined();
    expect(
      serverDb.getTenantStudents('cafe-alfa').filter((s) => s.tenantSlug === 'cafe-alfa')
    ).toHaveLength(0);
    expect(serverDb.findUserByEmail(tenantAUserEmail)).toBeUndefined();

    // 4. Login after deletion -> 401/403 (never success)
    const delLoginReq = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: tenantAUserEmail, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const delRes = await loginRoute.POST(delLoginReq);
    expect(delRes.ok).toBe(false);
    expect(delRes.cookies.get(auth.AUTH_COOKIE_NAME)).toBeUndefined();

    // 5. Recreating a business with the exact same name/slug starts with 0 old students/transactions
    const linkReborn = serverDb.createBlankOnboardingLinkServer({ plan: 'pro' });
    const reborn = serverDb.completeSelfOnboardingServer({
      token: linkReborn.onboardingToken.token,
      businessName: 'Cafe Alfa',
      ownerName: 'Nuevo Dueño',
      ownerPhone: '3005556677',
      ownerEmail: 'nuevo-alfa@test.local',
      password,
    });
    expect(reborn.success).toBe(true);
    expect(reborn.tenant?.slug).toBe('cafe-alfa');
    expect(serverDb.getTenantStudents('cafe-alfa')).toHaveLength(0);
    expect(serverDb.getTenantTransactions('cafe-alfa')).toHaveLength(0);
  });
});
