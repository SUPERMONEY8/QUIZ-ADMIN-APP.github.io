# Work Scheduler Software - Development Plan for Cursor AI
## Pure HTML/CSS/JavaScript (No Node.js or NPM)

---

## PHASE 1: Project Setup & Core Structure

### Step 1.1 - Project Initialization
**Prompt for Cursor AI:**
```
Create a complete HTML5 desktop application structure (single page application).

Files needed:
1. index.html - main entry point with all HTML structure
2. styles.css - all styling (use modern CSS Grid/Flexbox)
3. app.js - main application logic and initialization
4. database.js - local IndexedDB database management
5. ui.js - UI rendering and manipulation
6. scheduler.js - scheduling algorithm logic

Requirements:
- Use IndexedDB for local persistent storage (no server needed)
- Single HTML file that loads all JavaScript modules
- No external dependencies, use vanilla JavaScript only
- Structure for Windows 7/8/10/11 compatibility
- Minimum window size: 1200x800
```

### Step 1.2 - IndexedDB Database Schema
**Prompt for Cursor AI:**
```
Create database.js with IndexedDB implementation:

Database: "WorkSchedulerDB"
Version: 1

Object Stores:
1. groups
   - keyPath: "id"
   - indexes: "name"
   - fields: id, name, createdDate

2. members
   - keyPath: "id"
   - indexes: ["groupId", "name"]
   - fields: id, groupId, name, createdDate

3. schedules
   - keyPath: "id"
   - indexes: ["groupId", "workDate", "memberId"]
   - fields: id, groupId, memberId, workDate, isVacation, manualOverride, originalMemberId, reason, createdDate

4. settings
   - keyPath: "key"
   - fields: key, value

Include functions:
- initDB() - creates/opens database
- addGroup(name)
- addMember(groupId, name)
- addSchedule(groupId, memberId, workDate)
- updateSchedule(scheduleId, newMemberId, reason)
- getVacations(memberId, date)
- getAllGroups()
- getGroupMembers(groupId)
- etc.

All functions should return Promises.
```

---

## PHASE 2: Core Scheduling Logic

### Step 2.1 - Fair Rotation Algorithm
**Prompt for Cursor AI:**
```
Create scheduler.js with core scheduling logic:

Function: findNextWorker(groupId, workDate)
Logic:
1. Get all members in group
2. Filter out members marked as vacation for this date
3. Get all schedules for past 90 days
4. Find which member worked longest ago (or never worked)
5. Return that member's ID
6. Handle edge case: if all members are on vacation, return null

Function: generateWorkday(groupId, workDate)
Logic:
1. Call findNextWorker(groupId, workDate)
2. Create new schedule record in database
3. Return assigned member details and date

Function: getWorkHistory(groupId, days = 90)
- Returns array of recent assignments for fair rotation tracking

Include error handling and logging.
```

### Step 2.2 - Vacation & Override Logic
**Prompt for Cursor AI:**
```
Create vacation and override functions in scheduler.js:

Function: markVacation(memberId, workDate)
- Marks member as unavailable on specific date
- Stores in schedules table with isVacation = true

Function: unmarkVacation(scheduleId)
- Removes vacation mark

Function: manualOverride(scheduleId, newMemberId, reason)
- Changes assigned member on specific schedule
- Stores original assignment for audit
- Reason is optional user note

Function: getAssignmentHistory(groupId, startDate, endDate)
- Returns all assignments in date range
- Shows original vs overridden assignments
- Shows who is on vacation

All functions return Promises.
```

---

## PHASE 3: Frontend - HTML Structure

### Step 3.1 - Main HTML Layout
**Prompt for Cursor AI:**
```
Create index.html with complete structure:

Navigation/Sidebar:
- App title "Work Scheduler"
- Navigation buttons: Dashboard, Groups Manager, Schedule View, History

Main Content Area (4 sections, show/hide via JavaScript):
1. Dashboard Section
2. Groups Manager Section
3. Schedule Generator Section
4. History/Schedule View Section

Include:
- Header with current date/time
- Footer with status messages
- All sections hidden by default (display: none)
- Semantic HTML5 elements
- Data attributes for element identification (data-group-id, data-member-id, etc.)

Use CSS Grid for overall layout, Flexbox for components.
```

### Step 3.2 - Styling (CSS)
**Prompt for Cursor AI:**
```
Create styles.css with complete styling:

Requirements:
- Modern, clean design
- Color scheme: professional blues/grays
- Responsive layout using CSS Grid/Flexbox
- Button styling: primary (blue), secondary (gray), danger (red)
- Input fields with focus states
- Table styling for data display
- Modal/dialog styling
- Loading spinner animation
- Hover states for all interactive elements
- Font: system fonts (no external imports)

Sections:
- Header and navigation
- Sidebar
- Main content area
- Modals and dialogs
- Forms
- Tables
- Cards/panels
- Responsive adjustments for different window sizes

Include dark mode toggle support.
```

---

## PHASE 4: Frontend - Dashboard

### Step 4.1 - Dashboard Component UI
**Prompt for Cursor AI:**
```
Add to index.html dashboard section:

Layout:
1. Statistics Cards:
   - Total Groups
   - Total Members
   - Assignments This Month
   - Members on Vacation Today

2. Main Action Button:
   - "Generate New Workday" (large, prominent, blue)

3. Quick Select:
   - Group dropdown
   - Date picker
   - Display selected

4. Result Display Area:
   - Shows "John assigned to HR group on 23/12/2025"
   - Shows why (last worked X days ago)
   - Assigned member name highlighted
   - Timestamp of generation

5. Recent Assignments:
   - Table showing last 10 assignments
   - Columns: Date, Group, Assigned Member, Status
   - Scrollable

6. Quick Actions:
   - "Manage Groups" button
   - "View History" button
```

### Step 4.2 - Dashboard Logic (ui.js)
**Prompt for Cursor AI:**
```
Add to ui.js dashboard rendering functions:

Functions:
- renderDashboard() - main render function
- updateStats() - fetch and display statistics
- loadGroups() - populate group dropdown
- onGenerateButtonClick() - handle generate click
- displayAssignmentResult(memberName, groupName, date) - show result
- loadRecentAssignments() - fetch and display last 10
- switchToSection(sectionName) - show/hide sections

Event listeners:
- Generate button click
- Group dropdown change
- Date picker change
- Quick action buttons

Update stats on page load and after each action.
```

---

## PHASE 5: Frontend - Groups Manager

### Step 5.1 - Groups List UI
**Prompt for Cursor AI:**
```
Add to index.html groups manager section:

Layout:
1. Header with "Create New Group" button (blue)

2. Groups List (table or cards):
   Each group shows:
   - Group name (editable inline)
   - Member count
   - Action buttons: Edit Members, Delete, Generate Workday
   - Last updated date

3. Create Group Modal:
   - Input field for group name
   - Member list area (starts empty)
   - "Add Member" button with input field
   - Members to add: list with delete buttons
   - "Create Group" and "Cancel" buttons
   - Validation message area

4. Edit Members Modal:
   - Group name (editable)
   - List of current members (editable, with delete button each)
   - "Add New Member" input
   - Save/Cancel buttons

5. Delete Confirmation:
   - "Are you sure?" message
   - Confirm/Cancel buttons
```

### Step 5.2 - Groups Manager Logic (ui.js & database.js)
**Prompt for Cursor AI:**
```
Add to ui.js and database.js:

UI Functions:
- renderGroupsList() - show all groups
- showCreateGroupModal()
- showEditMembersModal(groupId)
- showDeleteConfirmation(groupId)
- addMemberInput() - show input for new member in modal
- removeMemberFromForm(memberId) - remove from unsaved list

Event Listeners:
- "Create New Group" button
- Delete buttons for each group
- Edit buttons for each group
- Save group button
- Save members button
- Add member button in modals
- Inline edit for group name

Database Functions:
- createGroup(groupName) - returns new group with ID
- updateGroupName(groupId, newName)
- deleteGroup(groupId) - delete group and all members
- getAllGroups() - returns all groups with member counts
- addMemberToGroup(groupId, memberName)
- updateMemberName(memberId, newName)
- deleteMemberFromGroup(memberId)

Validation:
- No empty group names
- No duplicate group names
- No duplicate member names within group
- Confirmation before deletion
```

---

## PHASE 6: Frontend - Schedule Generator

### Step 6.1 - Schedule Generator UI
**Prompt for Cursor AI:**
```
Add to index.html schedule generator section:

Layout:
1. Selection Area:
   - Group dropdown (required)
   - Date picker (default today)
   - "Generate Workday" button (large, primary)

2. Result Display:
   - Card showing assignment result
   - Display: "John" (large text)
   - "assigned to HR" 
   - "on 23/12/2025"
   - "Last worked: 5 days ago"
   - Show assignment timestamp

3. Quick Actions on Result:
   - "Generate for Tomorrow" button
   - "Edit Assignment" button (opens override modal)
   - "Mark as Vacation" button

4. Manual Override Modal:
   - Show current: "John assigned to HR on 23/12/2025"
   - Dropdown to select different member from same group
   - Optional reason/notes field
   - "Apply Override" and "Cancel" buttons
   - Confirmation: "Changed from John to Sarah"

5. Vacation Marking Modal:
   - Member name display
   - Date display
   - "Mark as Vacation" button
   - Confirmation message
```

### Step 6.2 - Schedule Generator Logic
**Prompt for Cursor AI:**
```
Add to ui.js schedule functions:

Functions:
- renderScheduleGenerator()
- loadGroupsForScheduler() - populate dropdown
- onGenerateButtonClick() - main handler
- displayScheduleResult(memberId, memberName, groupName, workDate) - show result
- showManualOverrideModal(scheduleId, currentMemberId, groupId)
- showVacationModal(scheduleId)
- applyManualOverride(scheduleId, newMemberId, reason)
- markAsVacation(scheduleId, memberId, workDate)
- generateForTomorrow(groupId)

Database Integration:
- Call scheduler.generateWorkday(groupId, workDate)
- Call scheduler.manualOverride(scheduleId, newMemberId, reason)
- Call scheduler.markVacation(memberId, workDate)

Error Handling:
- Display error if all members are on vacation
- Show message if group has no members
- Validation for date selection
```

---

## PHASE 7: Frontend - Vacation Manager

### Step 7.1 - Vacation Calendar UI
**Prompt for Cursor AI:**
```
Add to index.html new "Vacation Manager" section:

Layout:
1. Selection Area:
   - Group dropdown
   - Member dropdown (loads after group selected)
   - Month/Year selector

2. Calendar View:
   - Show full month calendar
   - Days are clickable
   - Vacation days highlighted (gray background, "V" label)
   - Normal days white
   - Today highlighted with border

3. Actions:
   - Click date to toggle vacation mark
   - "Mark All Month" button (for bulk marking)
   - "Clear All Month" button
   - "Bulk Edit" button for multiple dates
   - Show count: "3 vacation days in December"

4. Vacation List:
   - Show all vacation marks for selected member
   - Table: Date, Action (remove)
   - Sort by date

5. Confirmation:
   - "Mark John as vacation on 23/12/2025?" 
   - Yes/No buttons
```

### Step 7.2 - Vacation Manager Logic
**Prompt for Cursor AI:**
```
Add to ui.js vacation functions:

Functions:
- renderVacationManager()
- loadGroupsForVacation()
- onGroupSelectVacation(groupId) - load members dropdown
- renderCalendar(year, month, memberId)
- onDateClickVacation(memberId, date)
- toggleVacation(memberId, date)
- markBulkVacation(memberId, startDate, endDate)
- clearBulkVacation(memberId, startDate, endDate)
- getVacationMarks(memberId, month, year) - returns array of dates

Database Integration:
- Use scheduler.markVacation()
- Use scheduler.unmarkVacation()
- Fetch vacation list for calendar display

UI Updates:
- Refresh calendar after each action
- Update vacation count
- Show confirmation dialogs
```

---

## PHASE 8: Frontend - History & Reports

### Step 8.1 - Schedule History UI
**Prompt for Cursor AI:**
```
Add to index.html history section:

Layout:
1. Filters:
   - Group dropdown (all groups option)
   - Start date picker
   - End date picker
   - "Apply Filters" button
   - "Reset" button

2. Statistics:
   - Total assignments in range
   - Most worked: "John (12 times)"
   - Least worked: "Sarah (3 times)"
   - Total overrides: "5 changes made"

3. Schedule Table:
   - Columns: Date | Group | Member | Original Assignment | Override? | Reason
   - Sort by: Date, Member, Group, Overrides
   - Color override rows differently (light orange)
   - Scrollable, paginated if large

4. Actions:
   - "Export to CSV" button
   - "Print" button
   - "Refresh" button

5. Detailed View:
   - Click row to see full details
   - Modal showing: full history for that assignment
```

### Step 8.2 - History Logic
**Prompt for Cursor AI:**
```
Add to ui.js history functions:

Functions:
- renderHistory()
- loadGroupsForHistory()
- applyHistoryFilters(groupId, startDate, endDate)
- displayScheduleTable(schedules) - render table
- sortTable(column) - sort by clicked column
- exportToCSV(data) - generate CSV file download
- calculateStatistics(schedules) - who worked most/least
- onRowClick(scheduleId) - show details modal

Database Integration:
- Call scheduler.getAssignmentHistory(groupId, startDate, endDate)
- Fetch member names to display
- Calculate override count

CSV Export:
- Format: Date, Group, Assigned Member, Original, Overridden, Reason
- Download as "schedule_export_[date].csv"

UI Updates:
- Show loading while fetching
- Display statistics above table
- Highlight override rows
```

---

## PHASE 9: App Logic & Event Management

### Step 9.1 - App Initialization (app.js)
**Prompt for Cursor AI:**
```
Create app.js main application logic:

Functions:
- initApp() - run on page load
  1. Initialize IndexedDB
  2. Set current date/time
  3. Render dashboard
  4. Load initial data
  5. Set up event listeners

- setUpEventListeners() - attach all global events
  1. Navigation buttons → switch sections
  2. All button clicks
  3. Form submissions
  4. Modal closes

- switchSection(sectionName) - show/hide sections
  1. Hide all sections
  2. Show selected section
  3. Refresh data for that section

- updateDateTime() - update header clock
  1. Show current date/time
  2. Update every minute

Include error handling and logging.
```

### Step 9.2 - Modal Management
**Prompt for Cursor AI:**
```
Create modal system in ui.js:

Functions:
- showModal(modalId) - display modal with overlay
- closeModal(modalId) - hide modal
- closeAllModals() - close all open modals
- confirmDialog(message, onConfirm, onCancel) - confirmation dialog

Features:
- Click overlay to close
- Escape key closes modal
- Focus management
- Smooth animations
- Multiple modals can be nested

Modals needed:
1. Create Group
2. Edit Members
3. Delete Confirmation
4. Manual Override
5. Vacation Mark
6. Assignment Details
7. Error Message
```

---

## PHASE 10: Data Persistence & Recovery

### Step 10.1 - Backup & Restore
**Prompt for Cursor AI:**
```
Add to database.js backup functions:

Functions:
- exportAllData() - get all data from all stores
  1. Read all groups
  2. Read all members
  3. Read all schedules
  4. Read all settings
  5. Return as JSON object

- importAllData(jsonData) - restore from backup
  1. Clear existing data (with confirmation)
  2. Import groups
  3. Import members
  4. Import schedules
  5. Verify integrity

- downloadBackup() - trigger browser download
  1. Call exportAllData()
  2. Convert to JSON string
  3. Create blob
  4. Trigger download as "backup_[date].json"

- uploadBackup(file) - read and import file
  1. Read file as text
  2. Parse JSON
  3. Call importAllData()
  4. Show status
```

### Step 10.2 - Auto-Save
**Prompt for Cursor AI:**
```
Add to app.js auto-save functions:

Features:
- Auto-save after every data change
- Debounce auto-save (wait 500ms after last change)
- Visual indicator: "Saving..." in status bar
- Show "All changes saved" when complete
- Handle auto-save errors gracefully

Functions:
- scheduleAutoSave() - debounce function
- performAutoSave() - actual save logic
- onDataChange() - trigger auto-save

Include in status bar:
- Last saved timestamp
- Sync indicator (✓ for synced)
```

---

## PHASE 11: UI Polish & User Experience

### Step 11.1 - Notifications & Feedback
**Prompt for Cursor AI:**
```
Create notification system in ui.js:

Functions:
- showNotification(message, type, duration)
  - Types: success, error, warning, info
  - Duration in milliseconds (default 3000)
  - Auto-dismiss

- showToast(message) - floating notification
  - Bottom right corner
  - Fades out
  - Non-blocking

Include notifications for:
- "Group created successfully"
- "Assignment generated: John"
- "Manual override applied"
- "Vacation marked"
- "Data saved"
- All error messages

Use different colors:
- Green for success
- Red for error
- Yellow for warning
- Blue for info
```

### Step 11.2 - Loading States
**Prompt for Cursor AI:**
```
Add loading states to ui.js:

Functions:
- showLoadingSpinner(elementId) - show spinner
- hideLoadingSpinner(elementId) - hide spinner
- disableButton(buttonId) - gray out button
- enableButton(buttonId) - re-enable button

Spinner:
- CSS animation (rotating circle)
- Displayed during async operations
- Show message: "Loading..."

Apply loading state to:
- Generate button while generating
- Save buttons while saving
- Delete confirmation while processing
- Export while generating file

Disable all conflicting buttons during operation.
```

### Step 11.3 - Keyboard Shortcuts
**Prompt for Cursor AI:**
```
Add keyboard shortcuts in app.js:

Shortcuts:
- Ctrl+G or Cmd+G - Go to Groups
- Ctrl+S - Generate Workday (if on Schedule section)
- Ctrl+H - Show History
- Escape - Close any open modal
- Enter - Submit form (if focused)
- Delete - Delete (with confirmation)

Functions:
- setUpKeyboardShortcuts() - attach event listeners
- handleKeyPress(event)
- showShortcutsHelp() - modal with all shortcuts

Add help button in header with shortcut list.
```

---

## PHASE 12: Testing & Final Polish

### Step 12.1 - Comprehensive Testing
**Prompt for Cursor AI:**
```
Create test cases to verify (manual testing):

Functionality:
- [ ] Create group with 5 members
- [ ] Generate workday - should rotate fairly
- [ ] Generate for same group multiple days - verify rotation
- [ ] Mark member as vacation - should skip them
- [ ] Remove vacation mark - should be available again
- [ ] Manual override - change assigned member
- [ ] View history - shows all assignments with overrides
- [ ] Delete member - verify no orphaned schedules
- [ ] Delete group - verify all related data deleted
- [ ] Export to CSV - file downloads correctly
- [ ] Reload app - all data persists

Edge Cases:
- [ ] All members on vacation - shows error
- [ ] Only 1 member in group - assign repeatedly
- [ ] Empty group - shows error
- [ ] Very old dates - verify algorithm works
- [ ] Large datasets - 1000+ assignments

Data Integrity:
- [ ] No duplicate assignments same day/group
- [ ] Original assignment preserved with override
- [ ] Vacation marks don't affect history
- [ ] Delete operations remove all related records
```

### Step 12.2 - Browser Compatibility
**Prompt for Cursor AI:**
```
Ensure compatibility:

Requirements:
- IndexedDB support (check in all browsers)
- CSS Grid and Flexbox support
- ES6 JavaScript features (const, let, arrow functions)
- Promise support (no callbacks)
- Date picker support

Test in:
- Chrome/Chromium
- Firefox
- Edge
- Internet Explorer (note: may not work, IE is legacy)

Fallbacks:
- Check IndexedDB support on load
- Show warning if not supported
- Graceful degradation for older CSS

Performance:
- App loads in <2 seconds
- Database operations <500ms
- UI updates smooth (60fps)
```

### Step 12.3 - Documentation
**Prompt for Cursor AI:**
```
Create user documentation:

Files:
1. README.txt - Installation and first use
2. USER_GUIDE.txt - Full feature walkthrough
3. SHORTCUTS.txt - Keyboard shortcuts reference
4. TROUBLESHOOTING.txt - Common issues and solutions

Content:
- Step-by-step setup guide
- How to create first group
- How to generate workday
- How to use vacation marking
- How to use manual override
- How to view history
- How to backup data
- FAQ section

Include:
- Screenshots (if possible)
- Common mistakes and fixes
- Data safety tips
- Contact/support info

All in plain text, no external tools needed.
```

---

## File Structure (Final)

```
work-scheduler/
├── index.html          (all HTML structure)
├── styles.css          (all styling)
├── app.js              (main app logic)
├── database.js         (IndexedDB management)
├── scheduler.js        (scheduling algorithm)
├── ui.js               (UI rendering & events)
├── README.txt
├── USER_GUIDE.txt
├── SHORTCUTS.txt
└── TROUBLESHOOTING.txt
```

---

## Implementation Sequence

**Step 1-3:** Database & Scheduling Logic (foundation)
**Step 4-6:** Main UI Sections (groups, scheduler, history)
**Step 7:** Vacation Manager
**Step 8:** History & Reports
**Step 9-10:** App initialization and data persistence
**Step 11:** Polish and user experience
**Step 12:** Testing and documentation

---

## Key Points

1. **Pure JavaScript** - No frameworks, no build tools
2. **IndexedDB** - Local storage, works offline
3. **Single Page App** - index.html, styles.css, and 4 JS files
4. **No Dependencies** - Works in any modern browser
5. **Fair Rotation** - Tracks work history to ensure fairness
6. **Manual Override** - User can always change system decision
7. **Vacation Marking** - Skip unavailable members
8. **Data Persistence** - All data saved locally in browser