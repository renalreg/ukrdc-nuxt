export interface WorkItemSummary {
  id: number
  personId: number
  masterId: number
}

export interface WorkItemShort extends WorkItemSummary {
  type: number
  description: string
  status: number
  lastUpdated: string
  updatedBy: string
  updateDescription: string
  attributes: object
}
