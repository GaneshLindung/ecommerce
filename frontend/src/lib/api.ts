const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  try {
    const payload = await res.json();
    if (payload?.message) {
      throw new Error(payload.message);
    }
  } catch (error) {
    if (error instanceof Error && error.message !== '[object Object]') {
      throw error;
    }
  }

  throw new Error(`API error: ${res.status}`);
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
  });
  return parseResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(res);
}
