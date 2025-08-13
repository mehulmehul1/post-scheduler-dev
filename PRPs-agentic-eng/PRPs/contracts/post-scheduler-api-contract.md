# Post Scheduler API Contract

Feature: Post Scheduling (Casts with Image Editing and Scheduling)

## Task: Create detailed API contract specification for backend/frontend coordination

1. **Define RESTful endpoints**:

```yaml
Base URL: /api/schedule

Endpoints:
- GET /api/schedule
  Query params: page, size, sort, filter
  Response: Page<ScheduleResponse>

- GET /api/schedule/{id}
  Path param: id (string/UUID)
  Response: ScheduleResponse

- POST /api/schedule
  Body: ScheduleRequest
  Response: ScheduleResponse (201 Created)

- PUT /api/schedule/{id}
  Path param: id (string/UUID)
  Body: ScheduleRequest
  Response: ScheduleResponse

- DELETE /api/schedule/{id}
  Path param: id (string/UUID)
  Response: 204 No Content
```

2. **Define request/response DTOs**:

```typescript
// Request DTO (for POST/PUT)
interface ScheduleRequest {
  text: string;           // min: 1, max: 280
  imageUrl?: string;      // valid URL, optional
  scheduledAt: string;    // ISO 8601 UTC timestamp
  fid: string;            // Farcaster FID
  method?: 'offchain' | 'onchain'; // Scheduling method
}

// Response DTO (for GET)
interface ScheduleResponse {
  id: string;             // UUID
  text: string;
  imageUrl?: string;
  scheduledAt: string;
  fid: string;
  status: 'queued' | 'due' | 'posted' | 'failed';
  createdAt: string;      // ISO 8601
  updatedAt: string;      // ISO 8601
  method: 'offchain' | 'onchain';
  errorMessage?: string;
}

// Page response wrapper
interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
```

3. **Define error responses**:

```json
{
  "timestamp": "2025-08-13T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/schedule",
  "errors": [
    {
      "field": "text",
      "message": "Text is required and must be 1-280 characters"
    },
    {
      "field": "scheduledAt",
      "message": "Must be a valid ISO 8601 UTC timestamp"
    }
  ]
}
```

4. **Define validation rules**:
- Backend: Use validation libraries (e.g., Zod, Bean Validation)
- Frontend: Matching Zod schemas

```
text: required, 1-280 chars
imageUrl: optional, must be valid URL
scheduledAt: required, ISO 8601 UTC
fid: required, valid Farcaster FID
method: optional, 'offchain' or 'onchain'
```

5. **Define status codes**:
- 200: OK (GET, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation)
- 404: Not Found
- 409: Conflict (duplicate)
- 500: Internal Server Error

6. **Integration requirements**:
- CORS: Allow frontend origin
- Content-Type: application/json
- Authentication: Bearer token (if needed for protected endpoints)
- Pagination: Standard page/size format
- Sorting: field,direction (e.g., "scheduledAt,asc")

7. **Backend implementation notes**:

```typescript
// Entity fields match response DTO
// Use DTO mapping utilities
// Repository method naming conventions
// Service layer validation
// Secure CRON endpoint for publishing
```

8. **Frontend implementation notes**:
```typescript
// Zod schemas match validation rules
// API client with base configuration
// TanStack Query hooks for data fetching
// Error handling utilities
// Real-time UI updates for status changes
```

---

Save this contract as: `PRPs/contracts/post-scheduler-api-contract.md`

Share this file between backend and frontend teams for alignment.
