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
  height?: string | number
  isTv?: boolean
  isLoading?: boolean
}

export default function MainCard({
  title = '',
  subTitle = '',
  image = '',
  selected,
  onPress,
  width,
  isTv,
  isLoading,
  height = '300px'
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
      <Skeleton isLoaded={!isLoading} style={{ width: '100%' }}>
        <Card
          style={{ width }}
          onPress={handleClick}
          isPressable={!!onPress}
          isHoverable={!!onPress}
          className={`h-[${height}]`}
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
