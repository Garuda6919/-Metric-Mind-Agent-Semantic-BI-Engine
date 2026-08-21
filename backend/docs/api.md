# MetricMind Backend API

## Base URL

http://localhost:5000

---

## Health Check

### GET /api/health

Response

```json
{
  "status": "OK",
  "message": "Backend is healthy"
}
```

---

## Chat API

### POST /api/chat

Request

```json
{
  "question": "Hello MetricMind"
}
```

Response

```json
{
  "success": true,
  "data": {
    "receivedQuestion": "Hello MetricMind",
    "aiResponse": "Mock AI response"
  }
}
```
