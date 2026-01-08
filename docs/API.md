# OpenDotDB API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Domain Search

Search for domains with filters.

**Endpoint:** `GET /api/domains/search`

**Query Parameters:**
- `q` (string): Search query
- `tld` (string, optional): Filter by TLD (e.g., .com)
- `page` (number, default: 1): Page number
- `limit` (number, default: 50, max: 100): Results per page
- `sortBy` (string, default: createdAt): Sort field
- `sortOrder` (string, default: desc): asc or desc

**Example:**
```bash
curl "http://localhost:3000/api/domains/search?q=tech&tld=.com&page=1&limit=20"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "domains": [...],
    "total": 150,
    "page": 1,
    "totalPages": 8,
    "limit": 20
  }
}
```

### 2. Add Domains (Bulk)

Add multiple domains to the database.

**Endpoint:** `POST /api/domains/search`

**Body:**
```json
{
  "domains": ["example.com", "test.net", "demo.io"]
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/domains/search \
  -H "Content-Type: application/json" \
  -d '{"domains": ["example.com", "test.net"]}'
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Successfully added 2 domains"
}
```

### 3. Keyword Analysis

Get detailed analysis for a specific keyword.

**Endpoint:** `GET /api/keywords/{word}`

**Example:**
```bash
curl "http://localhost:3000/api/keywords/tech"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keyword": "tech",
    "searchVolume": 15000,
    "cpc": 2.5,
    "competition": 0.75,
    "totalDomains": 1250,
    "trends": [...],
    "topDomains": [...]
  }
}
```

### 4. Update Keyword

Update keyword metadata.

**Endpoint:** `PUT /api/keywords/{word}`

**Body:**
```json
{
  "searchVolume": 20000,
  "cpc": 3.0,
  "competition": 0.8
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/keywords/tech \
  -H "Content-Type: application/json" \
  -d '{"searchVolume": 20000, "cpc": 3.0}'
```

### 5. Get Trends

Get trending keywords or trends for a specific keyword.

**Endpoint:** `GET /api/trends`

**Query Parameters:**
- `keyword` (string, optional): Specific keyword to get trends for
- `period` (string, default: 30d): Time period (7d, 30d, 90d, 365d)
- `limit` (number, default: 10): Number of trending keywords

**Examples:**
```bash
# Get trending keywords
curl "http://localhost:3000/api/trends?period=30d&limit=20"

# Get trends for specific keyword
curl "http://localhost:3000/api/trends?keyword=tech&period=90d"
```

**Response (trending keywords):**
```json
{
  "success": true,
  "data": [
    {
      "word": "tech",
      "searchVolume": 15000,
      "cpc": 2.5,
      "competition": 0.75,
      "recentTrend": {
        "date": "2026-01-08",
        "domainCount": 1250,
        "newDomains": 45
      },
      "sampleDomains": [...]
    }
  ]
}
```

### 6. Domain Monitoring

#### Get Monitors

**Endpoint:** `GET /api/monitor`

**Query Parameters:**
- `userId` (string, optional): Filter by user
- `isActive` (boolean, optional): Filter by active status

**Example:**
```bash
curl "http://localhost:3000/api/monitor?isActive=true"
```

#### Add Monitor

**Endpoint:** `POST /api/monitor`

**Body:**
```json
{
  "domainName": "example.com",
  "userId": "user123",
  "alertEmail": "user@example.com"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/monitor \
  -H "Content-Type: application/json" \
  -d '{"domainName": "example.com", "alertEmail": "user@example.com"}'
```

#### Delete Monitor

**Endpoint:** `DELETE /api/monitor?id={monitorId}`

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/monitor?id=cm1abc123"
```

### 7. Statistics

Get overall platform statistics.

**Endpoint:** `GET /api/stats`

**Example:**
```bash
curl "http://localhost:3000/api/stats"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDomains": 15000,
    "totalKeywords": 5000,
    "totalMonitors": 250,
    "recentDomains": [...],
    "trendingKeywords": [...],
    "tldDistribution": [...]
  }
}
```

## Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, there are no rate limits as this is an open-source, self-hosted solution. However, it's recommended to implement rate limiting in production environments.

## Authentication

The current version does not include authentication. For production use, consider adding authentication middleware to protect certain endpoints.
