export interface IFiles {
  _id: string
  userOwner: string
  path: string
  filename: string
  size: number
  isPublic: boolean
  userAccess: any[]
  createdAt: string
  updatedAt: string
  __v: number
}