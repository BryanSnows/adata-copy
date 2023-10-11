# Comunição Hardware API

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


## Diponibilidade por Chamber
- Através de um endpoint, será retornado a próxima chamber disponível para o controlador da célula.

**URL**
>GET: http://womst-dev.conecthus.org.br/api/v1/productivity/available_chamber

### Sucesso
*Code : 200*
```json
{
  "mst_id": 1,
  "mst_name": "chamber 01",
  "model": "IM2P33F3A NVMe ADATA 256GB",
  "work_order": "16712165",
  "hours": 3,
  "temperature": 55
}
```



### Error
*Code : 404*
* Quando não houver chamber disponível

```json
{
  "statusCode": 404,
  "message": "Não existe chamber disponível no momento",
  "error": "Not Found"
}
```

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