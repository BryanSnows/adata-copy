
## Histórico do SSD
- Através de um endpoint, será retornado o histórico do ssd trazendo a chamber que foi utilizada, endereço no fixture de teste, data e horário de teste

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