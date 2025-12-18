
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res
    .json()
    .catch(() => null as unknown as T | { message?: string });

  if (!res.ok) {
    const error: Error & { status?: number } = new Error(
      (data as { message?: string } | null)?.message || `API error: ${res.status}`,
    );
    error.status = res.status;
    throw error;
  }

  return data as T;
}
