import { BadRequestException, GoneException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { CodeError, CodeObject, VerifyCredentials } from "src/common/Enums";
import { AuthService } from "../auth.service";
import { UserService } from 'src/user/user.service';
import { ErroResponse } from "src/common/error-response";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, 
        private userService: UserService,) {
        super({
            usernameField: VerifyCredentials.verify_enrollment,
            passwordField: VerifyCredentials.verify_password
        })
    }

    async validate(enrollment: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(enrollment, password);
        const userFirst =  await this.userService.findByEnrollment(enrollment)

        if (!user && userFirst.user_status === false) {
            throw new BadRequestException(new ErroResponse(CodeError.IS_DESABLE,`Usuário desativado!`, CodeObject.USER))
        } else {
            if (!user && userFirst.user_first_access === false  && userFirst.user_password_status === true) {
                throw new UnauthorizedException(new ErroResponse(CodeError.INVALID_NUMBER,`Matrícula ou Senha Incorretas!`, CodeObject.USER));
            } else 
            
            if (!user && userFirst.user_first_access === true){
                throw new GoneException(new ErroResponse(CodeError.INCORRECT_FIRST_ACCESS_PASSWORD,`Senha de primeiro acesso inválida`, CodeObject.PASSWORD));
            }
    
            if (!user && userFirst.user_password_status === false) {
                throw new NotFoundException(new ErroResponse(CodeError.IS_BLOCKED,`Usuário bloqueado! Entre em contato com o Administrador.`, CodeObject.USER));
            }
        }

        return user;
    }

}