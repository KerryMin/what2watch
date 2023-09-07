import React from 'react'
import {
  Badge,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Skeleton
} from '@nextui-org/react'
import { CheckIcon } from './CheckIcon'

interface IMainCard {
  title?: string
  subTitle?: string
  image?: string
  selected?: boolean
  onPress?: () => void
  width?: string | number
  isTv?: boolean
  isLoadMore?: boolean
}

export default function MainCard({
  title = 'Genre',
  subTitle = '',
  image = '',
  selected,
  onPress,
  width,
  isTv,
  isLoadMore
}: IMainCard) {
  const handleClick = () => {
    onPress?.()
  }
  if (isLoadMore) {
    return (
      <Card
        style={{ width }}
        onPress={handleClick}
        isPressable={!!onPress}
        isHoverable={!!onPress}
        className={'h-[300px] flex items-center justify-center'}
      >
        <CardHeader className='flex-col !items-start z-10'>
          <h4
            style={{ width: '100%' }}
            className='text-center text-white font-medium text-large'
          >
            Load more
          </h4>
        </CardHeader>
      </Card>
    )
  }
  return (
    <Badge
      isInvisible={!selected}
      size='md'
      isOneChar
      content={<CheckIcon />}
      color='success'
    >
      <Skeleton isLoaded={!!title} style={{ width: '100%' }}>
        <Card
          style={{ width }}
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
            alt={title}
            className='z-0 w-full h-full object-cover'
            src={image}
          />
          {isTv && (
            <Chip
              color='warning'
              variant='bordered'
              className='absolute bottom-1 right-1' // Position the Chip at the bottom right
            >
              TV
            </Chip>
          )}
        </Card>
      </Skeleton>
    </Badge>
  )
}
