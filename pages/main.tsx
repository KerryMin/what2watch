import React from 'react'
import {
  QuestionnaireProvider,
} from '@/components/Questionnaire/Context'

import dynamic from 'next/dynamic'
import { QuestionModal } from '@/components/QuestionModal'
import { SearchModal } from '@/components/SearchModal'

const Home = dynamic(() => import('./Home'), { ssr: false })

export default function Main() {
  return (
    <>
      <Home />
      <SearchModal />
      <QuestionModal />
    </>
  )
}
