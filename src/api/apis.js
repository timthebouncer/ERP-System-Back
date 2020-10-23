import request from "./https";

const api = {
  Customer: {
    getList() {
      return request.get("/client/clients?searchKeyword=");
    },
    getSingleList(record){
      return request.get("/client/"+ record.id)
    }
    ,
    getClass() {
      return request.get("/client/classes");
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
  }
};

export default api;
