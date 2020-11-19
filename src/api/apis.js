import request from "./https";

const api = {
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
    }

  },
  Commodity:{
    getCommodityList(params){
      return request.get('/product/productList', {params})
    },
    addCommodity(data){
      return request.post('/product/addProduct', data)
    },
    updateCommodity(data){
      return request.put('/product/updateProduct/',data)
    },
    deleteCommodity(record) {
      return Promise.resolve('/product/deleteProduct/'+ record.id);
    }
  },
  Distribute:{
    getDistributeList(params){
      return request.get('deliveryOrder/orderList',{params})
    }
  },
  Label:{
    addLabel(data){
      return request.post('/tag/addProductTag',data)
    },
    searchProduct(searchKey,barcode) {
      return request.get("/product/getProduct?searchKey="+searchKey+"&barcode="+barcode);
    }
  }
};

export default api;
