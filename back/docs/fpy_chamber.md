
## Taxa de Aprovação
- Através de um endpoint, será retornado a taxa de aprovação com a quantidade aprovada na primeira vez / quantidade testada

**URL**
>GET: http://womst-dev.conecthus.org.br/api/v1/fpy_chamber

### Sucesso
*Code : 200*
```json
{
  "mst_id": 1,
  "mst_name": "MST 1",
  "history": [
  {
    "quantity_tested": 210,
    "first__approved_quantity": 208,
    "percentage_rate": 99,
    "date": "10/12/2022"
  },
  {
    "quantity_tested": 210,
    "first__approved_quantity": 208,
    "percentage_rate": 99,
    "date": "11/12/2022"
  }],

  "mst_id": 2,
  "mst_name": "MST 2",
  "history": [
  {
    "quantity_tested": 210,
    "first__approved_quantity": 208,
    "percentage_rate": 99,
    "date": "10/12/2022"
  },
  {
    "quantity_tested": 210,
    "first__approved_quantity": 208,
    "percentage_rate": 99,
    "date": "11/12/2022"
  }],
}
```



### Error
*Code : 404*
* id da MST inválido

```json
{
  "statusCode": 404,
  "message": "id da mst inválido",
  "error": "Not Found"
}
```