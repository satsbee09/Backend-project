class ApiResponse{
    constructor(statusCode, Data, message="Success"){
         this.statusCode=statusCode
         this.data=data  
         this.message=message
         this.success=statusCode<400
    }
}