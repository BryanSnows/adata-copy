## Consulta de ocupação de armário
- Consulta referente a ocupação de armário na MST

**URL**
>GET: https://womst-dev.conecthus.org.br/api/v1/productivity/cabinet/occupation

## Query Param
* Será enviado um array de seriais aprovados
```json
{
    "cabinet_number": 1,
	"initial_date": "2022-12-01",
    "final_date": "2022-12-19"
}
```

### Sucesso
*Code : 200*
```json
{
  	"msts": [
        {
            "work_order": 01020304,
            "mst_name": "MST 1",
            "cabinet_number": 1,
            "without_total_capacity": 6,
            "date": "2022-12-19"
        },
    ]
}
```

### Error
*Code : 404*
* Quando o número do armário não for encontrado
```json
{
	"statusCode": 404,
	"message": "Armário ${cabinet_number} inexistente!",
	"error": "Not Found"
}
```

*Code : 409*
* Quando a data inicial for maior que a data final
```json
{
	"statusCode": 409,
	"message": "Data inicial: ${initial_date} não pode ser maior que data final: ${final_date}!",
	"error": "Conflict"
}
```