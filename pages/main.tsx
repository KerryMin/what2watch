import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react'
import Questionnaire from '@/components/Questionnaire'
import {
  QuestionnaireProvider,
  useQuestionnaireContext
} from '@/components/Questionnaire/Context'
import { Fab } from '@/components/Fab'

import dynamic from 'next/dynamic'

const Home = dynamic(() => import('./components/Home'), { ssr: false })

function QuestionModal() {
  const context = useQuestionnaireContext()
  const {
    state: { mediaType, genre },
    questionsModalDisclosure
  } = context
  const mediaNextSymbol = !!genre.length ? ' > ' : ''
  const mediaTypes = mediaType.map((l) => l.label).join(' + ')
  const genreTypes = genre.map((l) => l.label).join(', ')
  const modalTitle = `${mediaTypes + mediaNextSymbol} ${genreTypes}`

  const handleClose = () => {
    questionsModalDisclosure.onClose()
  }

  return (
    <>
      <Modal
        scrollBehavior={'inside'}
        size='4xl'
        backdrop={'blur'}
        isOpen={questionsModalDisclosure.isOpen}
        onClose={handleClose}
      >
        <ModalContent>
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {modalTitle}
            </ModalHeader>
            <ModalBody>
              <Questionnaire />
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
      <Fab onClick={questionsModalDisclosure.onOpen} />
    </>
  )
}

export default function Main() {
  return (
    <QuestionnaireProvider>
      <Home />
      <QuestionModal />
    </QuestionnaireProvider>
  )
}
