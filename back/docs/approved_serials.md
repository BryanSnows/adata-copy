## Cadastro de seriais aprovados na API do MES
- Após o robô enviar um array de posições dos seriais com defeito, a API do MST irá realizar uma requisição enviando os seriais aprovados para API do MES

**URL**
>POST: https://womst-dev.conecthus.org.br/api/v1/mes-consume/APPROVED_SERIAL

## Body
* Será enviado um array de seriais aprovados
```json
{
	"serial_numbers": [
		"xyz123",
		"xyz456",
		"xyz789"
	]
}
```

### Sucesso
*Code : 201*
```json
{
  	"serial_numbers": [
		"xyz123",
		"xyz456",
		"xyz789"
	]
}
```

### Error
*Code : 404*
* Quando o número do serial não for encontrado
```json
{
	"statusCode": 404,
	"message": "Serial ${serial_number} inexistente!",
	"error": "Not Found"
}
```

*Code : 409*
* Quando o número do serial já estiver sido aprovado
```json
{
	"statusCode": 409,
	"message": "Serial ${serial_number} já foi aprovado!",
	"error": "Conflict"
}
```