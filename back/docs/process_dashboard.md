## Consulta de chambers utilizadas no momento em tempo real
- Consulta em tempo real de chambers por work order, tempo de teste restante e porcentagem de capacidade total

**URL**
>GET: https://womst-dev.conecthus.org.br/api/v1/productivity/dashboard

### Success
*Code : 200*
```json
{
    "total_ssds": 720,
	"chambers": [
		{
			"mst_name": "Chamber 01",
            "cabinet": 1,
            "work_order": 01020304,
            "capacity_percentage": 50,
            "ssd_quantity": 180,
            "remaining_time_percentage": 50,
            "remaining_time": "00:30:00"
		},
		{
			"mst_name": "Chamber 02",
            "cabinet": 2,
            "work_order": 01020304,
            "capacity_percentage": 50,
            "ssd_quantity": 180,
            "remaining_time_percentage": 50,
            "remaining_time": "00:40:00"
		},
		{
			"mst_name": "Chamber 03",
            "cabinet": 3,
            "work_order": 04030201,
            "capacity_percentage": 100,
            "ssd_quantity": 360,
            "remaining_time_percentage": 50,
            "remaining_time": "01:00:00"
		},
        {
			"mst_name": "Chamber 04",
            "cabinet": 0,
            "work_order": 0,
            "capacity_percentage": 0,
            "ssd_quantity": 0,
            "remaining_time_percentage": 50,
            "remaining_time": "00:00:00"
		},
	]
}
```