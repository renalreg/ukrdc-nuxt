import Vue from 'vue'
import { ConnectorMessage } from '@/interfaces/mirth'

export interface modalInterface extends Vue {
  show: () => void
  hide: () => void
  toggle: () => void
}

export interface messageViewerModalInterface extends Vue {
  show: (message: ConnectorMessage) => void
  hide: () => void
  toggle: () => void
}
