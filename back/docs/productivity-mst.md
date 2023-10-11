## Produtividade chamber hora a hora
- Peças aprovadas e reprovadas por hora, podendo-se configurar o período (intervalo/data) de consulta

- Através da URL abaixo, passando como parametro número da mst e data, podemos obter o total do dia.

**URL**
> GET: https://womst-dev.conecthus.org.br/api/v1/productivity-mst/{mst_number}?data_init=2022-12-01&data_end=2022-12-01

### Sucesso
*Code : 200*

```json
{
    "total_aproved": 300,
    "total_reproved": 100,

    "fpy_aproved": 20,
    "fpy_reproved": 50,

    "productivity": [
        {
            "mst_number": "mst_number",
            "aproved": 150,
            "reproved": 50
        },
          {
            "mst_number": "mst_number",
            "aproved": 150,
            "reproved": 50
        },
    ]
}
```
**URL**

- Através desse endpoint, passando como parametros o número da mst, data e hora, podemos ter um histórico hora-hora da produtivdade das chambers (MST's)

> GET: https://womst-dev.conecthus.org.br/api/v1/productivity-mst-hour/{mst_number}?data=2022-12-19&07:00&08:00

### Sucesso
*Code : 200*
```json
{
  "produtivit": [
    {
      "aprovaded": 52,
      "reproved": 4,
      "hour": "7:00"
    },
    {
      "aprovaded": 52,
      "reproved": 4,
      "hour": "8:00"
    },
    {
      "aprovaded": 53,
      "reproved": 4,
      "hour": "9:00"
    }
  ],
  "total_reproved": 10,
  "tatal_aproved": 450
}
```

### Sucesso

* Quando não há há dados de produtividade

```json
{
    "total_aproved": 300,
    "total_reproved": 100,

    "fpy_aproved": 20,
    "fpy_reproved": 50,   
    
    "productivity": []
}
```
### Error

*Code : 404*

* Quando o número da chamber (mst) passado, não estiver cadastrado e/ou inexistente.

```json
{
    "statusCode": 404,
    "message": "Mst ${mst_number} não cadastrado!",
    "error": "Not Found"
}
```