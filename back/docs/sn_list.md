
## Relatório de Histórico do SSD
- Através de um endpoint, será retornado uma listagem de todo o histórico do ssd, retornando o número de série, mst, test fixture slot, data/horário de teste e status do teste (aprovado/reprovado), podendo ser configurável um filtro para status do teste, mst, e test fixture

**URL**
>GET: http://womst-dev.conecthus.org.br/api/v1/ssd_history

### Sucesso
*Code : 200*
```json
{
  "items": [
    {
      "ssd_id": 1,
      "serial": "SN1212345",
      "mst_name": "chamber 01",
      "cabinet": "cabinet 01",
      "position": 323,
      "date": "02/10/2022",
      "hours": 4,
      "status": true,
  }],
  "meta": {
    "totalItems": 1,
    "itemCount": 7,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

**URL**
>GET: http://womst-dev.conecthus.org.br/api/v1/ssd_history/{serial}

### Sucesso
*Code : 200*
```json
[
  {
  "ssd_id": 1,
  "serial": "SN4545454",
  "work_order": "245454",
  "model": "SSD M1 DELL",
  "cliente": "DELL SOLUTIONS",
  "history": [
    {
      "mst_name": "mst 1",
      "status": true,
      "position": 323,
      "cabinet": "cabinet 01",
      "date": "02/10/2022",
      "hours": 4
    },
    {
      "mst_name": "mst 2",
      "status": false,
      "position": 323,
      "cabinet": "cabinet 01",
      "date": "02/10/2022",
      "hours": 4
    },
    {
      "mst_name": "mst 3",
      "status": true,
      "position": 323,
      "cabinet": "cabinet 01",
      "date": "02/10/2022",
      "hours": 4
    }
  ]
 }
]
```

### Sucesso
*Code : 200*
* Ao filtrar, não retorna dados
```json
{
  data: [],
  message: "Não existe dados cadastrados"
}
```



### Error
*Code : 404*
* Quando o número de serial for inválido

```json
{
  "statusCode": 404,
  "message": "Número de serial inválido",
  "error": "Not Found"
}
```