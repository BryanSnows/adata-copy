
## Alerta de MST Chamber iniciada
- Através de um endpoint, será retornado o status de inicialização da mst chamber quando iniciar os testes de ssds

**URL**
>POST: http://womst-dev.conecthus.org.br/api/v1/productivity/mst_alert_started/{mst_id}

### Sucesso
*Code : 200*
```json
{
  "mst_id": 1,
  "mst_name": "chamber 01",
  "mst_alert_started": true
}
```



### Error
*Code : 404*
* Quando não houver id cadastrado

```json
{
  "statusCode": 404,
  "message": "Não existe mst chamber com esse id",
  "error": "Not Found"
}
```