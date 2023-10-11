## Atrelar armário a seriais
- O robô irá se comunicar através desse endpoint para enviar informação do número do armário e array de seriais para serem atrelados

**URL**
>POST: https://womst-dev.conecthus.org.br/api/v1/productivity/{cabinet_number}/put_serials

## Body
* Será enviado o número do armário e um array com 3 seriais por vez referente ao processo atual
```json
{
	"slots": [
		{
			"position": 1,
			"ssd_serial": "xyz123"
		},
		{
			"position": 2,
			"ssd_serial": "xyz456"
		},
		{
			"position": 3,
			"ssd_serial": "xyz789"
		}
	]
}
```

### Success
*Code : 201*
```json
{
  	"process": 0001,
	"cabinet": 1,
	"slots": [
		{
			"position": 1,
			"ssd_serial": "xyz123"
		},
		{
			"position": 2,
			"ssd_serial": "xyz456"
		},
		{
			"position": 3,
			"ssd_serial": "xyz789"
		}
	]
}
```

### Error
*Code : 404*
* Quando o armário não for encontrado
```json
{
	"statusCode": 404,
	"message": "Armário ${cabinet} não cadastrado!",
	"error": "Not Found"
}
```

*Code : 409*
* Quando o serial já estiver sido cadastrado
```json
{
	"statusCode": 409,
	"message": "Serial ${serial} já cadastrado!",
	"error": "Conflict"
}
```