import { Navbar } from '@/components/navbar'
import { Link } from '@nextui-org/link'
import { Head } from './head'

export default function DefaultLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Head />
      <Navbar />
      {children}
      <footer className='w-full flex items-center justify-center py-3 '>
        <span className='text-default-600 mr-2'>Powered by </span>
        <Link
          isExternal
          className='flex items-center gap-1 text-current mr-2'
          href='https://nextui-docs-v2.vercel.app?utm_source=next-app-template'
          title='nextui.org homepage'
        >
          <p className='text-primary'>NextUI</p>
        </Link>
        <Link
          isExternal
          className='flex items-center gap-1 text-current mr-2'
          href='https://openai.com/'
          title='openai.com homepage'
        >
          <p className='text-primary'>GPT 3.5</p>
        </Link>
        <Link
          isExternal
          className='flex items-center gap-1 text-current mr-2'
          href='https://www.themoviedb.org/?language=en-US'
          title='themoviedb.org homepage'
        >
          <p className='text-primary'>TMDB</p>
        </Link>
        <Link
          isExternal
          className='flex items-center gap-1 text-current mr-2'
          href='https://www.justwatch.com/'
          title='justwatch.com homepage'
        >
          <p className='text-primary'>JustWatch API</p>
        </Link>
      </footer>
    </div>
  )
}
