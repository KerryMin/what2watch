export function createEmptyArray(length: number) {
  return new Array(length).fill(null)
}

export function combineAndOrder<T>(arr1: any[], arr2: any[]): any[] {
  const result: any[] = []
  const maxLength = Math.max(arr1.length, arr2.length)

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) {
      result.push(arr1[i])
    }
    if (i < arr2.length) {
      result.push(arr2[i])
    }
  }

  return result
}
