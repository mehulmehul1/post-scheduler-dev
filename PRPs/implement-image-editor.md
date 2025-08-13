# PRP Task: Implement TOAST UI Image Editor

## Context
```yaml
context:
  docs:
    - url: https://github.com/nhn/tui.image-editor/tree/master/packages/tui-image-editor#readme
      focus: Initialization and export methods

  patterns:
    - file: C:/Users/mehul/OneDrive/Desktop/Daily-Code/post-scheduler-dev-1/PRPs-agentic-eng/PRPs/tui_image_editor_cheatsheet.md
      copy: >-
        new ImageEditor('#editor', {
          includeUI: {
            loadImage: { path: '/default.jpg', name: 'Sample' },
            menu: ['filter', 'text', 'crop']
          },
          cssMaxWidth: 700,
          cssMaxHeight: 500
        });

  gotchas:
    - issue: "SSR compatibility issues"
      fix: "Dynamically import component with { ssr: false "
    - issue: "Canvas size constraints"
      fix: "Always specify cssMaxWidth/Height"
```

## Task Structure

ACTION ./components/Editor.tsx:
  - OPERATION: >-
      import ImageEditor from 'tui-image-editor';
      export const Editor = ({ onExport }) => {
        useEffect(() => {
          const editor = new ImageEditor(...);
          return () => editor.destroy();
        }, []);
        return <div id="editor"></div>;
      }
  - VALIDATE: test/editor.test.tsx verifies filter application
  - IF_FAIL: Check canvas initialization and lifecycle
  - ROLLBACK: Remove component and dependencies

ACTION ./lib/pinata.ts:
  - OPERATION: >-
      export const uploadImage = async (blob) => {
        const formData = new FormData();
        formData.append('file', blob);
        const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${PINATA_JWT}` },
          body: formData
        });
        return `ipfs://${(await res.json()).IpfsHash}`;
      }
  - VALIDATE: curl -F 'file=@test.jpg' -H "Authorization: Bearer $PINATA_JWT" https://api.pinata.cloud/pinning/pinFileToIPFS
  - IF_FAIL: Verify JWT permissions
  - ROLLBACK: Restore previous upload implementation

## Task Sequencing

1. **Setup Tasks**: Install dependencies
2. **Core Changes**: Editor component implementation
3. **Integration**: IPFS upload workflow
4. **Validation**: Unit and integration testing
5. **Cleanup**: Type refinements

## Validation Strategy

- Verify all 5 filter types work correctly
- Test crop and text overlay functionality
- Confirm IPFS upload returns valid URL
- Validate error handling for large images

## Quality Checklist

- [ ] Correct React integration pattern
- [ ] Proper cleanup in useEffect
- [ ] Verified Pinata API compatibility
- [ ] Handle common failure scenarios
- [ ] 100% test coverage for export workflows