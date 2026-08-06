// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
import { getLauncherData } from '@/lib/launcher'

export async function GET() {
  try {
    const data = await getLauncherData();
    if (!data) return Response.json({ error: 'Failed to fetch launcher version' }, { status: 500 });
    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch launcher version:', error);
    return Response.json({ error: 'Failed to fetch launcher version' }, { status: 500 });
  }
}
