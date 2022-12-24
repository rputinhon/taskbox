export default class Search {
  searchString = ''; //string
  fields = []; //string

  constructor(searchString, fields) {
    this.searchString = searchString
    this.fields = fields
  }
}
