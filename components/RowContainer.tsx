import React, { ReactNode } from 'react'

interface IRowContainer {
  isScrollable?: boolean
  title: string | ReactNode
  children: ReactNode
}
export function RowContainer({ isScrollable, children, title }: IRowContainer) {
  const scrollableClasses = isScrollable
    ? 'flex overflow-x-scroll'
    : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6'

  return (
    <div className='container mx-auto px-4 mt-8'>
      <h2 className='text-2xl font-semibold mb-4'>{title}</h2>

      <div className={`${scrollableClasses} gap-4`}>{children}</div>
    </div>
  )
}
