import request from './https'

const api = {
  Login: {
    userLogin(formData) {
      return request.post('/api/login', formData)
    },
    loginIdentify() {
      return request.get('session/isAuthenticated')
    },
    logOut() {
      return request.post('/api/logout')
    }
  },
  Customer: {
    getList(params) {
      return request.get('/client/clients/', { params })
    },
    getSingleList(record) {
      return request.get('/client/' + record.id)
    },
    getClass() {
      return request.get('/class/classList')
    },
    add(data) {
      return request.post('/client/addClient', data)
    },
    update(data) {
      return request.put('/client/updateClient', data)
    },
    delete(record) {
      return request.delete('/client/removeClient/' + record.id)
    },
    discount(params) {
      return request.get('/discount/getClientDiscount/', { params })
    },
    discountRemove(row) {
      return request.delete('/discount/deleteDiscount/' + row.id)
    },
    discountNoPages(params) {
      return request.get('/discount/clientDiscount?', { params })
    }
  },
  Classify: {
    addClass(data) {
      return request.post('/class/addClass', data)
    },
    updateClass(data) {
      return request.put('/class/updateClass', data)
    },
    deleteClass(id) {
      return request.delete('/class/deleteClass/' + id)
    }
  },
  Inventory: {
    getList(productName, depotId, pageNumber, pageSize) {
      return request.get(
        '/inventory/stockList?productName=' +
          productName +
          '&depotId=' +
          depotId +
          '&pageNumber=' +
          pageNumber +
          '&pageSize=' +
          pageSize
      )
    },
    edit(data) {
      return request.put('/inventory/updateStock', data)
    },
    searchProduct(searchKey) {
      return request.get('/product/getProduct?searchKey=' + searchKey)
    },
    addInventory(data) {
      return request.post('/inventory/stockIn', data)
    },
    deleteInventory(id) {
      return request.delete('/inventory/deleteInventory/' + id)
    },
    getInventoryLogList(data) {
      return request.post('/inventoryLog/list', data)
    },
    onlyCustomerList() {
      return request.get('/client/clientList?searchKey=')
    },
    getStockDetail(params) {
      return request.get('inventory/getStock?', { params })
    }
  },
  Commodity: {
    getCommodityList(params) {
      return request.get('/product/productList/', { params })
    },
    getCommodityDetail(params) {
      return request.get('/product/getProduct', { params })
    },
    addCommodity(data) {
      return request.post('/product/addProduct', data)
    },
    updateCommodity(data) {
      return request.put('/product/updateProduct', data)
    },
    deleteCommodity(record) {
      return request.delete('/product/deleteProduct/' + record.id)
    },
    getSalesProduct(params) {
      return request.get('/product/getSalesProduct/', { params })
    },
    getCommodityDiscount(params) {
      return request.get('/discount/getProductDiscountList?', { params })
    },
    editStatus(data) {
      return request.put(
        '/product/changeStatus?productId=' +
          data.productId +
          '&status=' +
          data.status
      )
    }
  },
  Distribute: {
    getDistributeList(params) {
      return request.get('deliveryOrder/orderList', { params })
    },
    getDistributeDetail(record) {
      return request.get('/deliveryOrder/getDetail?orderId=' + record.orderId)
    },
    deleteOrderList(record) {
      return request.delete('/deliveryOrder/cancelOrder/' + record.orderId)
    },
    addOrder(data) {
      return request.post('/deliveryOrder/addOrder', data)
    },
    editOrder(data) {
      return request.put('/deliveryOrder/editOrder', data)
    },
    getOrderNo(params) {
      return request.get('/deliveryOrder/getOrderSerialNo?', { params })
    },
    deleteCommodityDiscount(row) {
      return request.delete('/deliveryOrderDetail/deleteDetail/' + row.id)
    },
    printTag(data){
      return request.post('/printTag',data)
    }
  },
  Label: {
    addLabel(data) {
      return request.post('/tag/addProductTag', data)
    },
    searchProduct(searchKey, barcode) {
      return request.get(
        '/product/getProduct?searchKey=' + searchKey + '&barcode=' + barcode
      )
    },
    getTagList(tagName, pageNumber, pageSize) {
      return request.get(
        '/tag/tagList?tagName=' +
          tagName +
          '&pageNumber=' +
          pageNumber +
          '&pageSize=' +
          pageSize
      )
    },
    getAllTag() {
      return request.get('/tag/tags')
    },
    editTag(data) {
      return request.put('/tag/editTag', data)
    },
    deleteTag(id) {
      return request.delete('/tag/deleteTag/' + id)
    }
  },
  Depot: {
    getDepotList(params) {
      return request.get('/productDepot/productDepotList', { params })
    },
    addDepot(data) {
      return request.post('/productDepot/addProductDepot', data)
    },
    deleteDepot(id) {
      return request.delete('/productDepot/deleteProductDepot/' + id)
    },
    updateDepot(data) {
      return request.put('/productDepot/updateProductDepot', data)
    }
  },
  Materials: {
    getMaterialsList(name, pageNumber, pageSize) {
      return request.get(
        '/material/getMaterialPage?name=' +
          name +
          '&size=' +
          pageSize +
          '&number=' +
          pageNumber
      )
    },
    addMaterial(data) {
      return request.post('/material/addMaterial', data)
    },
    delMaterial(id) {
      return request.delete('/material/delMaterial/' + id)
    },
    updateMaterial(data) {
      return request.put('/material/updateMaterial', data)
    },
    getDepotList(name) {
      return request.get('/materialDepot/getSearchList?name=' + name)
    },
    addDepot(data) {
      return request.post('/materialDepot/addDepot', data)
    },
    deleteDepot(id) {
      return request.delete('/materialDepot/delDepot/' + id)
    },
    updateDepot(data) {
      return request.put('/materialDepot/updateDepot', data)
    },
    getList() {
      return request.get('/materialDepot/getList')
    },
    getMaterialsLogList(data) {
      return request.get(
        '/materialLog/getPage?key=' +
          data.key +
          '&startDate=' +
          data.startDate +
          '&endDate=' +
          data.endDate +
          '&action=' +
          data.action +
          '&size=' +
          data.size +
          '&number=' +
          data.number
      )
    }
  }
}

export default api
