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
  isTv,
  isLoading,
  height = '300px',
  width = '200px'
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
        <div className='text-center'>
          <h4 className='text-white font-medium text-large'>{title}</h4>
          <h3 className='text-white font-medium text-large'>{subTitle}</h3>
        </div>
        <Card
          style={{ width }}
          onPress={handleClick}
          isPressable={!!onPress}
          isHoverable={!!onPress}
          className={`h-[${height}]`}
        >
          <Image
            removeWrapper
            alt={title}
            style={{ width, height }}
            className={`z-0 w-full object-cover`}
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
