export default {
  methods: {
    formatDate(rawDate: string): string {
      const d: number = Date.parse(rawDate)
      const newDate = new Date(d)
      return newDate.toLocaleString()
    },
  },
}
