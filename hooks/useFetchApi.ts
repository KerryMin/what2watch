import { fetchCall } from '@/helpers/nextHelpers'
import { useEffect, useState } from 'react'

export function useFetchApi<T>(
  route: string,
  // TODO: make this type safe
  props?: { tryAgain?: any; skip?: boolean; variables?: any }
) {
  const [error, setError] = useState<any | undefined>()
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState(props?.skip ? false : true)

  async function makeCall() {
    if (props?.skip) {
      return
    }
    setLoading(true)
    try {
      const data = await fetchCall(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Content type for sending JSON
        },
        body: JSON.stringify(props?.variables || {})
      })
      setData(data)
    } catch (e) {
      setError(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    makeCall()
  }, [props?.tryAgain])

  return { data, loading, error }
}
