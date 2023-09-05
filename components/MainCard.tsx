import React from 'react'
import { Badge, Card, CardHeader, Image } from '@nextui-org/react'
import { CheckIcon } from './CheckIcon'

interface IMainCard {
  title: string
  subTitle?: string
  image?: string
  selected?: boolean
  onPress?: () => void
}

export default function MainCard({
  title = 'Genre',
  subTitle = '',
  image = '',
  selected,
  onPress
}: IMainCard) {
  const handleClick = () => {
    onPress?.()
  }
  return (
    <Badge
      isInvisible={!selected}
      size='md'
      isOneChar
      content={<CheckIcon />}
      color='success'
    >
      <Card
        onPress={handleClick}
        isPressable={!!onPress}
        isHoverable={!!onPress}
        className={'h-[300px]'}
      >
        <CardHeader className='absolute z-10 top-1 flex-col !items-start'>
          <h4 className='text-white font-medium text-large'>{title}</h4>
          <h3 className='text-white font-medium text-large'>{subTitle}</h3>
        </CardHeader>
        <Image
          removeWrapper
          alt='Card background'
          className='z-0 w-full h-full object-cover'
          src={image}
        />
      </Card>
    </Badge>
  )
}
