import { Timestamp } from '../shared.type'

export type Customization = {
  id: string
  userId: string
  patternName?: string
  title?: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export type CustomizationDto = {
  id?: Customization['id']
  title?: Customization['title']
  patternName?: Customization['patternName']
}
