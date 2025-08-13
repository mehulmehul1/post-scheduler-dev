# PRP Task: Configure Farcaster Mini App Manifest

## Context
```yaml
context:
  docs:
    - url: https://miniapps.farcaster.xyz/docs/specification
      focus: '.well-known/farcaster/mini-app-manifest'

  patterns:
    - file: C:/Users/mehul/OneDrive/Desktop/Daily-Code/post-scheduler-dev-1/PRPs-agentic-eng/PRPs/miniapps_spec.md
      copy: >-
        {
          "name": "Post Scheduler",
          "description": "Schedule Farcaster casts",
          "url": "https://scheduler.example.com",
          "fcframeId": "post-scheduler"
        }

  gotchas:
    - issue: "Manifest location requirements"
      fix: "Must be at /.well-known/farcaster/mini-app-manifest.json"
    - issue: "URL protocol constraints"
      fix: "Must use HTTPS for production deployments"
```

## Task Structure

ACTION ./.well-known/farcaster/mini-app-manifest.json:
  - OPERATION: >-
      mkdir -p .well-known/farcaster &&
      echo '{"name":"Post Scheduler", "description":"Schedule Farcaster casts", "url":"${DEPLOYMENT_URL}", "fcframeId":"post-scheduler"}' > .well-known/farcaster/mini-app-manifest.json
  - VALIDATE: curl -s $DEPLOYMENT_URL/.well-known/farcaster/mini-app-manifest.json | jq .name
  - IF_FAIL: Verify directory structure and JSON syntax
  - ROLLBACK: Delete .well-known/farcaster directory

## Task Sequencing

1. **Setup Tasks**: Directory creation
2. **Core Changes**: Manifest configuration
3. **Integration**: None
4. **Validation**: Endpoint verification
5. **Cleanup**: None

## Validation Strategy

- Check manifest exists at correct path
- Validate JSON structure
- Verify fcframeId uniqueness
- Confirm production URL meets requirements

## Quality Checklist

- [ ] Correct directory structure
- [ ] Valid JSON format
- [ ] Proper environment variable usage
- [ ] Verified with Farcaster client
- [ ] No placeholder values remain