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
import Home from './components/Home'
import { Fab } from '@/components/Fab'

function QuestionModal() {
  const context = useQuestionnaireContext()
  const isNeedToDoQuestionnaire =
    !context.state.mediaType.length || context.state.genre.length === 0
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultOpen: isNeedToDoQuestionnaire
  })
  const mediaNextSymbol = !!context.state.genre.length ? ' > ' : ''
  const mediaTypes = context.state.mediaType.map((l) => l.label).join(' + ')
  const genreTypes = context.state.genre.map((l) => l.label).join(', ')
  const modalTitle = `${mediaTypes + mediaNextSymbol} ${genreTypes}`

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Modal
        scrollBehavior={'inside'}
        size='4xl'
        backdrop={'blur'}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                {modalTitle}
              </ModalHeader>
              <ModalBody>
                <Questionnaire />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Fab onClick={onOpen} />
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
