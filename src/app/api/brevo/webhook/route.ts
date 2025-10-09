import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

export const dynamic = 'force-dynamic';

interface BrevoEvent {
  event?: string;
  email?: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.BREVO_WEBHOOK_SECRET;
    const headerSecret = request.headers.get('x-brevo-secret') || request.headers.get('X-Brevo-Secret');
    const authz = request.headers.get('authorization') || '';
    const bearer = authz.startsWith('Bearer ') ? authz.slice(7) : undefined;
    if (secret && headerSecret !== secret && bearer !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const events: BrevoEvent[] = Array.isArray(payload) ? payload : [payload];

    const supabase = createServiceRoleClient();
    const toDisable = new Set<string>();

    for (const evt of events) {
      const e = (evt.event || '').toLowerCase();
      const email = (evt.email || '').toLowerCase();
      if (!email) continue;
      if (['unsubscribed', 'spam', 'hardbounce', 'softbounce', 'blocked'].includes(e)) {
        toDisable.add(email);
      }
    }

    if (toDisable.size > 0) {
      const emails = Array.from(toDisable);
      const { error } = await supabase
        .from('blog_subscribers')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .in('email', emails);
      if (error) {
        console.error('Webhook update error:', error);
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, disabled: Array.from(toDisable) });
  } catch (err: any) {
    console.error('Brevo webhook error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

