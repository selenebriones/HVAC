import type { APIRoute } from 'astro';

export const prerender = false;

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const SENDER_EMAIL = 'noreply@futurite.info';
const SENDER_NAME = 'Contacto Sistemas HVAC';
const RECIPIENT_EMAILS = ['dev@futurite.com', 'asistente@mxhvac.com'];
const LEAD_SOURCE = 'Sistemas HVAC';
const MIN_SUBMIT_MS = 2000;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatFechaRegistro(date: Date): string {
  const parts = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('[api/contact] Falta la variable de entorno BREVO_API_KEY.');
    return new Response(
      JSON.stringify({ success: false, message: 'No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const honeypot = (data.empresa_web || '').trim();
  const loadedAt = Number(data.loadedAt);
  const elapsedMs = Date.now() - loadedAt;

  if (honeypot || !loadedAt || elapsedMs < MIN_SUBMIT_MS) {
    console.error(`[api/contact] Envío bloqueado por filtro anti-spam (honeypot: ${JSON.stringify(honeypot)}, elapsedMs: ${elapsedMs}).`);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const nombre = (data.nombre || '').trim();
  const apellido = (data.apellido || '').trim();
  const email = (data.email || '').trim();
  const telefono = (data.telefono || '').trim();
  const mensaje = (data.mensaje || '').trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!nombre || !apellido || !email || !telefono || !mensaje || !emailPattern.test(email)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Por favor completa todos los campos con datos válidos.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  let siteUrl = request.headers.get('origin') || new URL(request.url).origin;
  const pageUrl = (data.pageUrl || '').trim();
  if (pageUrl) {
    try {
      siteUrl = new URL(pageUrl).href;
    } catch {
      // URL inválida enviada por el cliente: se mantiene el origin como respaldo.
    }
  }
  const fechaRegistro = formatFechaRegistro(new Date());

  const htmlContent = `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4b6a88; font-size: 24px; margin: 0 0 16px;">Nuevo Prospecto Registrado</h2>
      <p style="font-size: 15px; line-height: 1.5; margin: 0 0 20px;">Se ha recibido una nueva solicitud de contacto para <strong>${LEAD_SOURCE}</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 15px; margin: 12px 0;"><strong>Nombre:</strong> ${escapeHtml(nombre)} ${escapeHtml(apellido)}</p>
      <p style="font-size: 15px; margin: 12px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: underline;">${escapeHtml(email)}</a></p>
      <p style="font-size: 15px; margin: 12px 0;"><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
      <p style="font-size: 15px; margin: 12px 0;"><strong>Mensaje:</strong> ${escapeHtml(mensaje).replace(/\n/g, '<br />')}</p>
      <p style="font-size: 15px; margin: 12px 0;"><strong>Fecha de registro:</strong> ${fechaRegistro}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 13px; color: #9ca3af; margin: 0;">Este mensaje fue enviado automáticamente desde la Landing Page:</p>
      <p style="font-size: 13px; margin: 4px 0 0;"><a href="${escapeHtml(siteUrl)}" style="color: #9ca3af; word-break: break-all;">${escapeHtml(siteUrl)}</a></p>
    </div>
  `;

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: RECIPIENT_EMAILS.map((recipientEmail) => ({ email: recipientEmail })),
        replyTo: { email, name: `${nombre} ${apellido}` },
        subject: `Nuevo Lead: ${LEAD_SOURCE} - ${nombre} ${apellido}`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[api/contact] Brevo respondió con error ${response.status}: ${errorBody}`);
      return new Response(
        JSON.stringify({ success: false, message: 'No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('[api/contact] Error al conectar con Brevo:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
