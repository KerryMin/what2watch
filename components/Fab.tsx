import { Button } from '@nextui-org/react'

export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <div className='fixed bottom-10 right-10'>
      <Button
        onClick={onClick}
        className='bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      >
        <svg
          className='w-8 h-8 mx-auto my-auto'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
          ></path>
        </svg>
      </Button>
    </div>
  )
}
