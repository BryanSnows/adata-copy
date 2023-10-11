## Cadastro de seriais ou posições com defeitos
- Após a finalização dos testes na chamber, o robô irá enviar o número da chamber um array de posições dos seriais com defeito

**URL**
>POST: https://womst-dev.conecthus.org.br/api/v1/productivity/{mst_number}/defects

## Body
* Será enviado o número da chamber e um array de posições de seriais com defeito ao final da retirada dos ssd's nos slots (3 posições por vez)
```json
{
	"positions": [
		1,
		2,
		3
	]
}
```

### Sucesso
*Code : 201*
```json
{
  	"process": 0001,
	"cabinet": 1,
    "chamber": 1,
    "work_order": 01020304,
	"defects": [
		{
			"position": 1,
			"test_position_count": 1,
			"ssd_serial": "xyz123",
			"test_serial_count": 1
		},
		{
			"position": 2,
			"test_position_count": 1,
			"ssd_serial": "xyz456",
			"test_serial_count": 1
		},
		{
			"position": 3,
			"test_position_count": 1,
			"ssd_serial": "xyz789",
			"test_serial_count": 1
		}
	]
}
```

### Error
*Code : 404*
* Quando a posição não existir
```json
{
	"statusCode": 404,
	"message": "Posição ${position} não existente!",
	"error": "Not Found"
}
```

*Code : 409*
* Quando a chamber informada não está em uso
```json
{
	"statusCode": 409,
	"message": "Chamber ${chamber} não está em uso!",
	"error": "Conflict"
}
```

## Métricas
*- Quando ocorre o primeiro teste não é possível saber se o defeito está no sdd ou no slot, somente a partir do segundo teste.*

*- Se testar o ssd defeituoso em outro slot/armário e tiver sucesso, então o defeito estava no slot anterior*

*- Se os defeitos persistirem mesmo testando em outro slot/armário, então o defeito está no SSD*