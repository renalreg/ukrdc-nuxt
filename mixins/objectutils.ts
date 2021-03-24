export default {
  methods: {
    isEmptyObject(someObject: Object) {
      return Object.keys(someObject).length === 0
    },
  },
}
