import { Button } from '@nextui-org/react'

export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <div className='z-10 fixed bottom-10 right-10'>
      <Button
        onClick={onClick}
        className='bg-purple-500 hover:bg-purple-600 text-white w-16 h-20 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z" clipRule="evenodd" />
        </svg>

      </Button>
    </div>
  )
}
