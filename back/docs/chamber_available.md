
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