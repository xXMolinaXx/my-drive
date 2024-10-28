export interface IFiles {
  _id: string
  userOwner: string
  path: string
  filename: string
  size: number
  isPublic: boolean
  userAccess: IuserAccess[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IuserAccess {
  userId: string,
  email: string
}
