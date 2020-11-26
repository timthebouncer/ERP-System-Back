import request from "./https";

const api = {
  Login:{
    userLogin(formData){
      return request.post("/api/login",formData)
    }
  },
  Customer: {
    getList(params) {
      return request.get("/client/clients/",{params});
    },
    getSingleList(record){
      return request.get("/client/"+ record.id)
    }
    ,
    getClass() {
      return request.get("/class/classList");
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
    discount(params){
      return request.get('/discount/getClientDiscount/',{params})
    },
    discountRemove(row){
      return request.delete('/discount/deleteDiscount/' + row.id)
    },
    discountNoPages(params){
      return request.get('/discount/clientDiscount?', {params})
    }
  },
  Classify: {
    addClass(data){
      return request.post('/class/addClass',data)
    },
    updateClass(data){
      return request.put('/class/updateClass',data)
    },
    deleteClass(id){
      return request.delete('/class/deleteClass/'+ id)
    }
  },
  Inventory: {
    getList(productName,pageNumber,pageSize) {
      return request.get("/inventory/stockList?productName="+productName+"&pageNumber="+pageNumber+"&pageSize="+pageSize);
    },
    edit(data){
      return request.put("/inventory/updateStock", data);
    },
    searchProduct(searchKey){
      return request.get("/product/getProduct?searchKey="+searchKey);
    },
    addInventory(data){
      return request.post("/inventory/stockIn",data);
    },
    deleteInventory(id){
      return request.delete("/inventory/deleteInventory/"+id);
    },
    getInventoryLogList(data) {
      return request.post("/inventoryLog/list",data);
    },
    onlyCustomerList() {
      return request.get('/client/clientList?searchKey=')
    }
  },
  Commodity:{
    getCommodityList(params){
      return request.get('/product/productList/', {params})
    },
    getCommodityDetail(params){
      return request.get('/product/getProduct',{params})
    },
    addCommodity(data){
      return request.post('/product/addProduct', data)
    },
    updateCommodity(data){
      return request.put('/product/updateProduct',data)
    },
    deleteCommodity(record) {
      return Promise.resolve('/product/deleteProduct/'+ record.id);
    }
  },
  Distribute:{
    getDistributeList(params){
      return request.get('deliveryOrder/orderList',{params})
    },
    getDistributeDetail(record){
      return request.get('/deliveryOrder/getDetail?orderId='+ record.orderId)
    },
    deleteOrderList(record) {
      return request.delete('/deliveryOrder/cancelOrder/'+ record.orderId);
    },
    addOrder(data){
      return request.post('/deliveryOrder/addOrder',data)
    }
  },
  Label:{
    addLabel(data){
      return request.post('/tag/addProductTag',data)
    },
    searchProduct(searchKey,barcode) {
      return request.get("/product/getProduct?searchKey="+searchKey+"&barcode="+barcode);
    },
    getTagList(tagName, pageNumber, pageSize){
      return request.get("/tag/tagList?tagName="+tagName+"&pageNumber="+pageNumber+"&pageSize="+pageSize)
    },
    editTag(data){
      return request.put("/tag/editTag",data)
    },
    deleteTag(id){
      return request.delete("/tag/deleteTag/"+id)
    }
  },
};

export default api;
