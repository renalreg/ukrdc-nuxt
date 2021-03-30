export default {
  methods: {
    isEmptyObject(someObject: Object) {
      if (someObject === null || someObject === undefined) {
        return true
      }
      return Object.keys(someObject).length === 0
    },
  },
}
