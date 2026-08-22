# Samples

## API Requests

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"secret"}'
```

### Create Candidate
```bash
curl -X POST http://localhost:8000/api/v1/candidates \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"skills":["python","fastapi"]}'
```

### Match
```bash
curl -X POST "http://localhost:8000/api/v1/matching/jobs/1/match" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"candidate_ids":[1,2,3],"limit":10}'
```

## Frontend Queries

```javascript
const { data } = useQuery({
  queryKey: ['candidates', filters],
  queryFn: () => candidateApi.list(filters)
});
```
