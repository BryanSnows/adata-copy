
export class ErroResponse {

    code: number
    message: string
    object: string

    constructor(code: number,  message: string, object: string){
       this.code = code;
       this.message = message;
       this.object = object
    }

   
}
