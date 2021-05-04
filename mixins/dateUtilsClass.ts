// super.js
import Vue from 'vue'
import Component from 'vue-class-component'

// Define a super class component
@Component
export default class DateComponent extends Vue {
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
  }
}
