export interface DashStatistics {
  day: number
  prev: number
  total: number
}

export interface DashUser {
  email?: string
  permissions: string[]
}

export interface DashResponse {
  message: string
  user: DashUser
  ukrdcrecords: DashStatistics
  workitems: DashStatistics
}
