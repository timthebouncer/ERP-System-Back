//搜尋後導回第一頁


export function gotoPageOne(){
  this.current = 1
  this.$api.Customer.getList({
    searchKeyword: this.search,
    className: this.match.name,
    pageNumber: this.current,
    pageSize: this.pageSize
  })
    .then(res => {
      this.total = res.data.totalElements
      this.tableData = res.data.content
    })
    .catch(err => {
      console.log(err)
    })
}

