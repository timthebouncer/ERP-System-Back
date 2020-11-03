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
    }
  },
  Inventory: {
    getList(productName,pageNumber,pageSize) {
      return request.get("/inventory/stockList?productName="+productName+"&pageNumber="+pageNumber+"&pageSize="+pageSize);
    }
  },
  Commodity:{
    addCommodity(){
      return request.post('/product/addProduct')
    },
    updateCommodity(data){
      return request.put('/product/updateProduct/',data)
    },
    deleteCommodity(record) {
      return Promise.resolve('/product/deleteProduct/'+ record.id);
    }
  }
};

export default api;
