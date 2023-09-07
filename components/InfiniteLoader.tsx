// components/InfiniteLoading.tsx
import { useState, useEffect, ReactNode } from 'react'

type DataItem = {
  id: number
  content: string
}

interface InfiniteLoadingProps {
  children: ReactNode
  fetchMoreData: () => Promise<DataItem[]>
}

export const InfiniteLoading: React.FC<InfiniteLoadingProps> = ({
  children,
  fetchMoreData
}) => {
  const [data, setData] = useState<DataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const newData = (await fetchMoreData()) || []
      if (newData?.length === 0) {
        setHasMore(false)
      } else {
        setData((prev) => [...prev, ...newData])
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

    if (scrollTop + clientHeight >= scrollHeight) {
      if (!loading && hasMore) {
        setLoading(true)
        const newData = await fetchMoreData()
        if (newData.length === 0) {
          setHasMore(false)
        } else {
          setData((prev) => [...prev, ...newData])
        }
        setLoading(false)
      }
    }
  }

  return (
    <div
      onScroll={handleScroll}
      className='overflow-y-scroll h-[500px] relative'
    >
      {children}
    </div>
  )
}
