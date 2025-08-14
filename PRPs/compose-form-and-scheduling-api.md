# PRP Task: Implement Compose Form and Scheduling API

## Context

```yaml
context:
  docs:
    - url: https://zod.dev/?id=basic-usage
      focus: schema validation for forms
    - url: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
      focus: Next.js Route Handlers (app/api)
  patterns:
    - file: PRPs-agentic-eng/PRPs/contracts/post-scheduler-api-contract.md
      copy: schedule endpoint and DTOs
  gotchas:
    - issue: "Ensure all times use UTC ISO 8601"
      fix: "Normalize with `new Date().toISOString()` before storing"
    - issue: "CRON endpoint must be protected"
      fix: "Require `CRON_SECRET` header in /api/publish"
```

## Task Structure

ACTION ./components/ComposeForm.tsx:

- OPERATION: >-
  Build React form for text (max 280 chars), optional image URL, and datetime picker.
  On submit, validate using `scheduleSchema` and POST to `/api/schedule`.
- VALIDATE: npm run lint components/ComposeForm.tsx && npx tsc --noEmit
- IF_FAIL: Verify field names and Zod schema alignment
- ROLLBACK: Revert changes to component.

ACTION ./lib/validation.ts:

- OPERATION: >-
  Export `scheduleSchema` with Zod matching API contract
  (`text`, `imageUrl?`, `scheduledAt`, `fid`, optional `method`).
- VALIDATE: node -e "require('./lib/validation').scheduleSchema.parse({text:'t',scheduledAt:new Date().toISOString(),fid:'1'})"
- IF_FAIL: Check Zod field definitions
- ROLLBACK: Delete file.

ACTION ./app/api/schedule/route.ts:

- OPERATION: >-
  Implement POST (create schedule) and GET (list schedules) using `scheduleSchema` and `db`.
- VALIDATE: curl -X POST http://localhost:3000/api/schedule -d '{"text":"hi","scheduledAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","fid":"1"}' -H 'Content-Type: application/json'
- IF_FAIL: Ensure JSON parsing and schema validation
- ROLLBACK: Restore previous route.

ACTION ./app/api/publish/route.ts:

- OPERATION: >-
  Create route scanning due posts via `db.getDue` and publish (stub) after verifying `CRON_SECRET`.
- VALIDATE: curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/publish
- IF_FAIL: Confirm secret header and db integration
- ROLLBACK: Remove route.

## Task Sequencing

1. **Setup Tasks**: Create validation schema
2. **Core Changes**: ComposeForm component
3. **Integration**: Schedule and publish API routes
4. **Validation**: Manual curl tests and lint/type checks
5. **Cleanup**: None

## Validation Strategy

- Use Zod to reject invalid forms
- Ensure API routes return 201/200 and proper errors
- Verify CRON endpoint processes due posts
- Run lint and type checks after implementation

## Quality Checklist

- [ ] Form enforces text length and required fields
- [ ] Times stored as UTC ISO strings
- [ ] Schedule POST/GET and publish routes follow API contract
- [ ] CRON endpoint secured by `CRON_SECRET`
- [ ] Linting and TypeScript checks pass
