import request from "./https";

const api = {
    Customer: {
        getClass() {
            return request.get("/client/classes")
        }
    }
};

export default api;