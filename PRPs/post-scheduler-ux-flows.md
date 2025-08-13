# Post Scheduler UX Flows

This document maps core user journeys for the post scheduler mini app. It focuses on image editing, scheduling posts, and viewing the queue of scheduled casts.

## Image Editing Flow
1. User taps **Edit Image** in the composer.
2. Image editor opens with upload prompt.
3. User applies filters, crops, or adds text/stickers.
4. Edited image is saved and returned to the composer.

### Key Screen
```
+--------------------------------------+
| Header: Image Editor                 |
|--------------------------------------|
| [ Upload Area ]                      |
|                                      |
| [Filter][Crop][Text][Stickers][Undo] |
|                                      |
|           Apply  Cancel              |
+--------------------------------------+
```

### Edge Cases & Errors
- **No image uploaded**: show "Add an image to start editing" placeholder.
- **Unsupported file type**: alert "Please upload a JPG or PNG file".
- **Large file size**: display "Image exceeds 10MB limit" and prevent upload.
- **Editor load failure**: offer retry with message "Editor failed to load".

## Scheduling Flow
1. After composing, user selects **Schedule Post**.
2. Date and time picker appears.
3. User confirms, post is added to queue.

### Key Screen
```
+-------------------------------+
| Schedule Post                 |
|-------------------------------|
| Date: [ 2025-05-20 ▼ ]        |
| Time: [ 14:30 ▼ ]             |
|                               |
|      Schedule   Cancel        |
+-------------------------------+
```

### Edge Cases & Errors
- **Past date/time**: error "Select a future time".
- **Missing date/time**: prompt "Choose date and time".
- **Network failure**: toast "Could not schedule, try again".
- **Double scheduling**: warning "Post already scheduled".

## Viewing Queue Flow
1. User opens **Scheduled Posts** from main menu.
2. Screen shows list of upcoming posts with edit and cancel options.

### Key Screens
#### List with Scheduled Posts
```
+--------------------------------------+
| Scheduled Posts                      |
|--------------------------------------|
| [Image] Caption...     20 May 14:30  |
| [Image] Another post   21 May 09:00  |
|                                      |
|                Back                  |
+--------------------------------------+
```

#### Empty State
```
+------------------------------+
| Scheduled Posts              |
|------------------------------|
|  (no posts scheduled)        |
|  "Schedule your first cast"  |
|                              |
|              Back            |
+------------------------------+
```

### Edge Cases & Errors
- **Fetch failure**: banner "Unable to load scheduled posts" with retry.
- **Post missing data**: show placeholder image and message "Details unavailable".
- **Queue empty**: render empty-state screen encouraging scheduling.
- **Cancellation failure**: alert "Could not cancel, please retry".
