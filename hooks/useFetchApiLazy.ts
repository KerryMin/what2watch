import { fetchCall } from '@/helpers/nextHelpers';
import { useState } from 'react';

export function useFetchApiLazy<T, S>(
  route: string
): [(variables?: S) => Promise<T | undefined>, { error: any; loading: boolean }] {
  const [error, setError] = useState<any | undefined>();
  const [loading, setLoading] = useState(false);

  async function makeCall(variables?: S) {
    setLoading(true);
    let data;
    try {
      data = await fetchCall(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Content type for sending JSON
        },
        body: JSON.stringify(variables || {}),
      });
    } catch (e) {
      setError(e);
    }
    setLoading(false);
    return data as T | undefined;
  }

  return [makeCall, { error, loading }];
}
