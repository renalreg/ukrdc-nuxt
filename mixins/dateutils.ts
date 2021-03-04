export default {
  methods: {
    formatDate(rawDate: string, t: boolean = true): string {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
      if (t === true) {
        options.hour = '2-digit'
        options.minute = '2-digit'
      }
      return new Date(Date.parse(rawDate)).toLocaleString([], options)
    },
  },
}
