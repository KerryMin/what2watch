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

function QuestionModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const context = useQuestionnaireContext()
  const mediaNextSymbol = !!context.state.genre.length ? ' > ' : ''
  const mediaTypes = context.state.mediaType.map((l) => l.label).join(' + ')
  const genreTypes = context.state.genre.map((l) => l.label).join(', ')
  const modalTitle = `${mediaTypes + mediaNextSymbol} ${genreTypes}`

  const handleClose = () => {}

  return (
    <Modal
      scrollBehavior={'inside'}
      size='4xl'
      backdrop={'blur'}
      isOpen={true}
      onClose={onClose}
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
  )
}

export default function Main() {
  return (
    <QuestionnaireProvider>
      <QuestionModal />
    </QuestionnaireProvider>
  )
}
