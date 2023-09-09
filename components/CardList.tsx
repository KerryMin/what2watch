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
  colSpan?: string
  selected: SelectedItems
  onPress: (item: ListItem) => void
}
export const CardsList = ({
  list,
  selected,
  onPress,
  colSpan = 'col-span-4'
}: ICardList) => {
  return (
    <div className={`grid grid-cols-12 gap-4`}>
      {list.map((item) => {
        const isSelected = !!selected.find((s) => s?.id === item.id)
        return (
          <div key={item.id} className={`${colSpan}`}>
            <MemoizedMainCard
              onPress={() => onPress(item)}
              selected={isSelected}
              title={item.label}
              image={item.image}
              width={200}
              height={300}
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
