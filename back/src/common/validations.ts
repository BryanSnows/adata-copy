import { BadRequestException } from "@nestjs/common"
import { CodeError, CodeObject, ValidType } from "./Enums";
import { ErroResponse } from "./error-response";


export class Validations {

    private static instance: Validations
    public static getInstance(): Validations {
        if (!Validations.instance) {
            Validations.instance = new Validations();
        }
        return Validations.instance;
    }

    validateWithRegex(str: string, description: string = 'campo', ...valid) {

        valid.forEach(data => {

            if (data === ValidType.IS_BOOLEAN) {
                if (!this.validRegex(/^(true|false)$/, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_NOT_BOOLEAN,`O valor deve conter apenas false ou true`, CodeObject.MST_SIDE))
                }
            }

            if (data === ValidType.IS_BIT) {
                if (!this.validRegex(/^(0|1)$/, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_NOT_BIT,`Campo cabinet_side aceita apenas 0 ou 1`, CodeObject.CABINET_SIDE))
                }
            }

            if (data === ValidType.IS_NUMBER) {
                if (this.validRegex(/[a-zA-Z!@#$%^&*(),.?":{}|<>]/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_NUMBER,`O campo ${description} deve conter apenas números`, CodeObject.VALUE))
                }
            }

            if (data === ValidType.DIFERENT_OF_ZERO) {
                if (this.validRegex(/^0/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.DIFERENT_OF_ZERO,`Não é possível cadastrar valores zero!`, CodeObject.VALUE))
                }
            }

            if (data === ValidType.MST_DIFERENT_OF_ZERO) {
                if (this.validRegex(/^0/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.DIFERENT_OF_ZERO,`O nome da MST não pode iniciar com 0!`, CodeObject.MST))
                }
            }

            if (data === ValidType.MST_IS_NUMBER) {
                if (this.validRegex(/[a-zA-Z!@#$%^&*(),.?":{}|<>]/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_NUMBER,`O campo nome da mst deve conter apenas números!`, CodeObject.MST))
                }
            }

            if (data === ValidType.CABINET_DIFERENT_OF_ZERO) {
                if (this.validRegex(/^0/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.DIFERENT_OF_ZERO,`O armário não pode ter nome igual a zero!`, CodeObject.CABINET))
                }
            }

            if (data === ValidType.CABINET_IS_NUMBER) {
                if (this.validRegex(/[a-zA-Z!@#$%^&*(),.?":{}|<>]/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_NUMBER,`O campo nome do painel deve conter apenas números!`, CodeObject.CABINET))
                }
            }
        

            if (data === ValidType.IS_STRING) {
                if (this.validRegex(/[\d]/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_STRING,`O nome não pode conter números`, CodeObject.NAME));
                }
            }

            if (data === ValidType.NO_SPACE) {
                if (this.validRegex(/\s+/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.NO_SPACE,`O nome ${description} não pode conter espaços em branco!!`, CodeObject.NAME))
                }
            }

            if (data === ValidType.NO_MANY_SPACE) {
                if (this.validRegex(/\s +/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.NO_SPACE,`O nome não pode conter 2 ou mais espaços em branco!!`, CodeObject.NAME))
                }
            }

            if (data === ValidType.NO_SPECIAL_CHARACTER) {
                if (this.validRegex(/[\\£¢¬!@#$%'_`´=~^&§ªº°;+-/\\¨*(),.?":{}||<>-]/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.NO_SPECIAL_CHARACTER,`O campo ${description} não pode conter caracteres especiais!!`, CodeObject.NAME))
                }
            }

            if (data === ValidType.OFFICE_NO_SPECIAL_CHARACTER) {
                if (this.validRegex(/[!@#$%'_`´=~^&§ªº°;+/¨*(),?":{}||<>]/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.NO_SPECIAL_CHARACTER,`O nome não pode conter caracteres especiais!!`, CodeObject.NAME))
                }
            }

            if (data === ValidType.SHIFT_NO_SPECIAL_CHARACTER) {
                if (this.validRegex(/[\\£¢¬!@#$%'_`´=~^&§ª;+/\\¨*(),?":{}||<>]/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.NO_SPECIAL_CHARACTER,`O nome não pode conter caracteres especiais!!`, CodeObject.NAME))
                }
            }

            if (data === ValidType.IS_EMAIL) {
                if (!this.validRegex(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+/i, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_EMAIL,'O email informado não é válido!!', CodeObject.EMAIL))
                }
            }

            if (data === ValidType.DATE) {
                if (!this.validRegex(/\d{2}\/\d{2}\/\d{4}/g, str)) {
                    throw new BadRequestException(`Data está em um formato inválido!`)
                }
            }
           
            if (data === ValidType.DATE_BR) {
                if (!this.validRegex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g, str)) {
                    throw new BadRequestException(`Data está em um formato inválido!`)
                }
            }

            if (data === ValidType.SPECIAL_CHARACTER) {
                if (!this.validRegex(/[!@#$%^&*(),.?":{}|<>-]/g, str)) {
                    throw new BadRequestException(new ErroResponse( CodeError.SPECIAL_CHARACTER,`A senha deve ter ao menos um caractere especial`, CodeObject.PASSWORD))
                }
            }

            if (data === ValidType.MINIMUM_ONE_NUMBER) {
                if (!this.validRegex(/[\d]/g, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.MIN_ONE_NUMBER,`O valor deve ter ao menos um número`, CodeObject.VALUE))
                }
            }

            if (data === ValidType.MINIMUM_ONE_STRING) {
                if (!this.validRegex(/[a-zA-Z]+/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_STRING,`O campo ${description} deve ter ao menos uma letra`, CodeObject.PASSWORD));
                }
            }

            if (data === ValidType.MINIMUM_ONE_NUMBER_STRING_SPECIAL_CHARACTER) {
                if (!this.validRegex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z])(?=.*[0-9]).+$/gm, str)) {
                    throw new BadRequestException(new ErroResponse(CodeError.IS_STRING,`O campo ${description} deve ter ao menos um caractere especial, uma letra e um número`, CodeObject.PASSWORD));
                }
            }
          
        })
    }

    verifyLength(value: string, description: string = 'campo', min: number = null, max: number = null) {

        if (value === null || value === undefined || value === '') {
            throw new BadRequestException(new ErroResponse(CodeError.NO_SPACE,`O campo ${description}, não pode conter espaços vazios!`, CodeObject.VALUE))
        }

        if (min !== null) {
            if (value.length < min) {
                throw new BadRequestException(new ErroResponse(CodeError.MIN_CHARACTER,`O campo ${description}, não pode ter menos que ${min} caracteres!`, CodeObject.VALUE))
            }
        }

        if (max !== null) {
            if (value.length > max) {
                throw new BadRequestException(new ErroResponse(CodeError.MAX_CHARACTER ,`O campo ${description}, não pode ter mais que ${max} caracteres!`, CodeObject.VALUE))
            }
            
        }

    }

    validRegex(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }

}