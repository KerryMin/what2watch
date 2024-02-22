import React from 'react'
import { QuestionModal } from '@/components/QuestionModal'
import { SearchModal } from '@/components/SearchModal'
import Home from '@/components/Home'
import useIsClient from '@/hooks/useIsClient';

export default function Main() {
  const isClient = useIsClient();
  if (!isClient) return null
  return (
    <>
      <Home />
      <SearchModal />
      <QuestionModal />
    </>
  )
}
