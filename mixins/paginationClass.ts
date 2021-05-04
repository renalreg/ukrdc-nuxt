// super.js
import Vue from 'vue'
import Component from 'vue-class-component'

import { singleQuery } from '@/utilities/queryUtils'

// Define a super class component
@Component
export default class PaginationComponent extends Vue {
  page = (singleQuery(this.$route.query.page) || 0) as number
  total: number = 0
  size: number = 20

  changePage(newPage: number): void {
    this.page = newPage
    const newQuery = Object.assign({}, this.$route.query, {
      page: newPage.toString(),
    })
    this.$router.push({
      path: this.$route.path,
      query: newQuery,
    })
  }
}
