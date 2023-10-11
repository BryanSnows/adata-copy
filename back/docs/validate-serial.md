## Validar serial
- O robô irá se comunicar através desse enpoint para verificar se os seriais estão atrelados a WO referente.

**URL**
> GET: https://womst-dev.conecthus.org.br/api/v1/validate-serial/{work_order}

### Sucesso

* Será enviado o número da work order e um array com os seriais atrelados; 

```json
{
 "work_order": 123456,
 "seriais": [
    "woabc123",
    "fg456wo",
    "GG7wo89",
 ]
}

```
### Error
*Code : 404*
* Quando o número da work-order não existir
```json
{
    "statusCode": 404,
    "message": "Work Order ${work_order} não cadastrada!",
    "error": "Not Found"
}
```
### Error
*Code : 404*
* Quando o serial não estiver atrelado àquela work-order
```json
{
    "statusCode": 404,
    "message": "serial ${serial_number}, não encontrado",
    "error": "Not Found"
}

