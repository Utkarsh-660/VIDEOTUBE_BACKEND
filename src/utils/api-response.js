

class ApiResponse{
    constructor(statuscode,message="success",data){
        this.data=data;
        this.statuscode=statuscode
        this.message=message

    }
}
export {ApiResponse};
