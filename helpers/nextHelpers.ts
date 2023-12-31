export const fetchCall = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  let data

  try {
    const res = await fetch(input, init)
    data = await res.json()
  } catch (error) {
    console.error('Error fetching:', error)
  }
  return data
}
