import { memo, useCallback } from 'react'
import MainCard from './MainCard'

export type ListItem = {
  id: string
  label: string
  image?: string
}

type SelectedItems = (ListItem | undefined)[]
interface ICardList {
  list: ListItem[]
  colWidth?: 6 | 12
  selected: SelectedItems
  onPress: (item: ListItem) => void
}
export const CardsList = ({
  list,
  selected,
  onPress,
  colWidth = 12
}: ICardList) => {
  return (
    <div className={`grid grid-cols-${colWidth} gap-4`}>
      {list.map((item) => {
        const isSelected = !!selected.find((s) => s?.id === item.id)
        return (
          <div key={item.id} className='col-span-12 sm:col-span-3'>
            <MemoizedMainCard
              onPress={() => onPress(item)}
              selected={isSelected}
              title={item.label}
              image={item.image}
            />
          </div>
        )
      })}
    </div>
  )
}

export function convertToListItem<T>(
  list: T[],
  mapping: { id: keyof T; label: keyof T; image: keyof T }
) {
  return list.map((l) => ({
    id: l[mapping.id] as string,
    label: l[mapping.label] as string,
    image: l[mapping.image] as string
  }))
}

const MemoizedMainCard = memo(MainCard)
