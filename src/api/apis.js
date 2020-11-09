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
      return request.get('deliveryOrder/getDetail?orderNo="20201105A0014"',{params})
    }
  }
};

export default api;
