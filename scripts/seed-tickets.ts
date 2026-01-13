import { connectToDatabase, MemberModel, ProjectModel, SprintModel, TaskModel, UserModel, WorkspaceModel } from '../src/lib/db';
import { TaskStatus, TaskType } from '../src/features/tasks/types';
import { MemberRole } from '../src/features/members/types';

type TicketSeed = {
  ticketNo: string;
  createdDate: string;
  sprintId: string;
  title: string;
  size: number;
  status: TaskStatus;
  assigneeUserId: string;
  createdByUserId: string;
  description: string;
};

const WORKSPACE_ID = '69348a98bcacb97acd2fa758';
const PROJECT_ID = '69349c51bb232369049a458b';
const DEFAULT_SPRINT_NAME = 'Phase 2 Sprint';

const TICKETS: TicketSeed[] = [
  {
    ticketNo: 'INST-155',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Figma: Integration status components (badges, banners, empty states)',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design small components for integration health: status badges, warning banners, empty state prompts, and inline error messages. Acceptance Criteria: - Component variants documented - Accessible contrast - Handoff notes included.',
  },
  {
    ticketNo: 'INST-156',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Backend: Integration settings endpoints (connect/disconnect/status)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Create endpoints for integration settings: connect, disconnect, fetch status, and health details. Include validation and secure secret storage references. Acceptance Criteria: - Status includes last sync time + last error - Secrets never returned - Permission checks enforced.',
  },
  {
    ticketNo: 'INST-157',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'React: Global toast/error handler for Phase-2 modules',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Implement shared toast + error boundary patterns across new modules (Analytics, Chat, Integrations). Standardize retry actions and error copy. Acceptance Criteria: - Consistent UX across modules - Error boundary prevents blank screens - Logged errors include correlation id.',
  },
  {
    ticketNo: 'INST-158',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'QA: Sanity test integration connect/disconnect flows',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Test integration connect/disconnect flow with invalid credentials, network failures, and retry behavior. Acceptance Criteria: - Defects logged with repro - Retest evidence recorded - No sensitive data exposed in UI.',
  },
  {
    ticketNo: 'INST-159',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'React: Chat widget embed component + theming hooks',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Build embeddable chat widget component with theming hooks (primary color, logo, position). Wire to backend session create and send-message APIs. Acceptance Criteria: - Works as standalone embed - Handles reconnect gracefully - Shows clear error state + retry.',
  },
  {
    ticketNo: 'INST-160',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Figma: Website chat widget UI (collapsed/expanded + states)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design website chat widget UI for embedding: launcher button, expanded chat window, user details capture, and states (offline, reconnect, error). Acceptance Criteria: - Mobile + desktop frames - Accessibility (focus order, contrast) - Interaction notes for open/close and typing indicators.',
  },
  {
    ticketNo: 'INST-161',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Requirements: Analytics drill-down reports (filters, export, saved views)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define drill-down report requirements: table columns, sorting, filters, export rules, and saved views. Acceptance Criteria: - Stories + AC complete - Export behavior defined - Permission rules documented.',
  },
  {
    ticketNo: 'INST-162',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Backend: KPI definitions mapping + API contract draft',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Draft API contract for KPI endpoints (request params, response shape, error codes). Map each KPI to source tables/fields and calculation method. Acceptance Criteria: - Contract reviewed by FE + QA - Each KPI includes formula and source field mapping - Error scenarios documented.',
  },
  {
    ticketNo: 'INST-163',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Sprint Dubai review notes + backlog adjustments',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Capture sprint review outcomes, defects, UX feedback, and adjust backlog priorities for next September sprint. Ensure actions are assigned and measurable. Acceptance Criteria: - Action items documented - Priority changes agreed - Risks updated.',
  },
  {
    ticketNo: 'INST-164',
    createdDate: '2025-09-01',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Phase 2 September kickoff: finalize backlog for Analytics + Comms + Chat + Integrations',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Run a September kickoff to lock Phase-2 backlog slices for Analytics, Communications, Website Chat and Integrations. Produce a prioritized backlog with P0/P1 labels, dependencies, and sprint goals. Acceptance Criteria: - Backlog prioritized and shared with team - Clear definition of done per module - Risks/assumptions captured (data readiness, provider limits).',
  },
  {
    ticketNo: 'INST-165',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Requirements: Communications module MVP (templates, delivery status, audit)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define Communications MVP: unified inbox, templates, compose flow, delivery status lifecycle, opt-out handling, and audit logs. Acceptance Criteria: - User stories + AC for each feature - Edge cases captured (provider down, retries) - Roles/permissions defined.',
  },
  {
    ticketNo: 'INST-166',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Backend: Website chat session schema + transcript storage',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Create DB schema for chat sessions and message transcripts. Support session lifecycle (start, active, closed), participant metadata, and linkage to CRM lead/contact. Acceptance Criteria: - Schema supports indexing by sessionId and leadId - Retention policy documented - PII fields identified for masking in logs.',
  },
  {
    ticketNo: 'INST-167',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'React: Integration settings screens (status + error view)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement integration settings UI: connect/disconnect actions, status indicators, last sync, and error details page. Acceptance Criteria: - Matches Figma patterns - Clear error messaging - Prevents duplicate connect requests.',
  },
  {
    ticketNo: 'INST-168',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'QA: Verify analytics page access controls + navigation links',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Test role-based access to Analytics routes and navigation visibility. Ensure unauthorized roles cannot reach analytics via direct URL. Acceptance Criteria: - Access blocked for non-permitted roles - Correct messaging shown - No broken navigation links.',
  },
  {
    ticketNo: 'INST-169',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'QA: Define test data matrix for analytics KPIs',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Create test data matrix mapping KPI scenarios to sample records (leads, deals, messages) so KPI calculations can be validated deterministically. Acceptance Criteria: - Covers happy path + edge cases - Includes expected values per KPI - Usable for automated testing later.',
  },
  {
    ticketNo: 'INST-170',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'React: Analytics routes + layout shell + permission gating',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Implement React routes for Analytics module and a shared layout shell. Add permission gating so only authorized roles can access Analytics. Acceptance Criteria: - Routes load without errors - Unauthorized users redirected with message - Skeleton loading placeholders in place.',
  },
  {
    ticketNo: 'INST-171',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Figma: Analytics dashboard overview (KPI cards + charts + filters) – v1',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Create high-fidelity Figma for Analytics Overview: KPI cards, trend charts, filter panel (date range, owner/team, source), and empty/loading/error states. Acceptance Criteria: - Desktop + tablet frames - Reusable components documented - Handoff notes for interactions (hover, drill-down).',
  },
  {
    ticketNo: 'INST-172',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Figma: Communications inbox layout (threads + composer drawer)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design communications inbox view with thread list, conversation pane, and composer drawer including templates and attachments. Acceptance Criteria: - Empty/loading/error states - Responsive behavior specified - Component variants (selected/unread/error).',
  },
  {
    ticketNo: 'INST-173',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'QA: Smoke test plan for September Phase-2 increments',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Create a smoke-test checklist for September deliveries (Analytics, Chat, Integrations). Include test data needs and environment assumptions. Acceptance Criteria: - Smoke suite covers critical paths - Test data requirements documented - Checklist reusable per sprint.',
  },
  {
    ticketNo: 'INST-174',
    createdDate: '2025-09-02',
    sprintId: '6935b45d95e8c7b36698b11a',
    title: 'Backend: Communications audit log structure + retention rules',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design audit log entries for outbound communications: who sent, channel, recipient, template, status changes, provider ids, and timestamps. Acceptance Criteria: - Immutable log entries - Searchable by lead/contact and agent - Retention policy defined.',
  },
  {
    ticketNo: 'INST-175',
    createdDate: '2025-09-04',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'React: Agent console (assignment + quick replies + transcript)',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement agent console UI: conversation list, assignment controls, quick replies, transcript view, and SLA indicators. Acceptance Criteria: - Real-time updates supported - Unread counts accurate - Keyboard navigation works.',
  },
  {
    ticketNo: 'INST-176',
    createdDate: '2025-09-04',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Requirements: Integration error handling & admin troubleshooting',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define error handling requirements: user-facing messages, admin troubleshooting steps, error codes, and when to alert. Acceptance Criteria: - Error matrix created - Admin UI requirements documented - Alerts thresholds defined.',
  },
  {
    ticketNo: 'INST-177',
    createdDate: '2025-09-05',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Sprint Seoul review + backlog grooming for next sprint',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Run sprint review, capture stakeholder feedback, and groom backlog for Toronto sprint. Ensure priorities updated based on learnings. Acceptance Criteria: - Actions and owners documented - Priority changes captured - Risks updated.',
  },
  {
    ticketNo: 'INST-178',
    createdDate: '2025-09-05',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'QA: Website chat agent console testing',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Test agent console workflows: assignment, handoff, quick replies, SLA timer display, and transcript persistence. Acceptance Criteria: - Defects logged with clear repro - Regression checks passed - Retest evidence recorded.',
  },
  {
    ticketNo: 'INST-179',
    createdDate: '2025-09-06',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Requirements: Website chat agent console workflows',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define agent console workflows: assignment, handoff, notes, transcript search, SLA timers, and escalation rules. Acceptance Criteria: - User stories with AC - Edge cases (agent offline, reassignment) - Roles and permissions defined.',
  },
  {
    ticketNo: 'INST-180',
    createdDate: '2025-09-07',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Figma: Agent console high-fidelity screens',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Create high-fidelity Figma for agent console: inbox list, active chat, assignment modal, notes panel, and SLA banners. Acceptance Criteria: - Full state coverage - Handoff annotations - Responsive frames.',
  },
  {
    ticketNo: 'INST-181',
    createdDate: '2025-09-07',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Backend: Saved views storage + API',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Add APIs and persistence for analytics saved views tied to user id. Validate permissions and prevent injection in filter payload. Acceptance Criteria: - CRUD endpoints - Input validation - Migration plan documented.',
  },
  {
    ticketNo: 'INST-182',
    createdDate: '2025-09-08',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Figma: Message status indicators + retry UX',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design status badges/icons for message lifecycle and retry UI flows (toast, inline error, confirmation). Acceptance Criteria: - Accessible iconography - Variants documented - Handoff specs.',
  },
  {
    ticketNo: 'INST-183',
    createdDate: '2025-09-09',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Backend: Agent assignment + queue routing rules',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement routing rules for assigning chats to agents/queues, including capacity limits and fallback routing. Acceptance Criteria: - Deterministic assignment logic - Audit of assignment changes - Handles offline agents.',
  },
  {
    ticketNo: 'INST-184',
    createdDate: '2025-09-09',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'React: Message status timeline in conversation view',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Show message status timeline (sent/delivered/failed) within conversation view including retry action for failures. Acceptance Criteria: - Status updates in near real-time - Retry available with confirmation - Clear error messaging.',
  },
  {
    ticketNo: 'INST-185',
    createdDate: '2025-09-10',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'React: Analytics drill-down reports (table + pagination + export trigger)',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Build the drill-down reports UI: sortable table, pagination, column chooser, and export trigger. Wire filters from dashboard to report view. Acceptance Criteria: - Pagination + sorting stable - Export triggers correct request - Empty/loading/error states included.',
  },
  {
    ticketNo: 'INST-186',
    createdDate: '2025-09-11',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Requirements: Communications delivery status lifecycle',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define status lifecycle for outbound messages (queued/sent/delivered/failed), retry rules, and how statuses surface to users. Acceptance Criteria: - Status transitions documented - Provider receipt mapping - UI requirements for statuses.',
  },
  {
    ticketNo: 'INST-187',
    createdDate: '2025-09-11',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'QA: Saved views regression tests',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Test saved views CRUD and ensure applying a view updates dashboard + reports consistently. Acceptance Criteria: - No data leakage across users - Edge cases tested - Retest passes.',
  },
  {
    ticketNo: 'INST-188',
    createdDate: '2025-09-12',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Backend: Delivery receipts + status updates (webhooks)',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement webhook handlers for delivery receipts from providers and update message status timeline reliably with idempotency. Acceptance Criteria: - Idempotent processing - Status history stored - Failures logged with retry.',
  },
  {
    ticketNo: 'INST-189',
    createdDate: '2025-09-13',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'React: Analytics saved views (persist filters)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Implement saved views for analytics filters so users can quickly apply common dashboards. Persist per user. Acceptance Criteria: - Create/edit/delete saved views - Default view loads automatically - Validation for duplicate names.',
  },
  {
    ticketNo: 'INST-190',
    createdDate: '2025-09-13',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'QA: Drill-down report testing (filters, sorting, export)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Test drill-down report behavior end-to-end: filters, sorting, pagination, export output columns, and permission restrictions. Acceptance Criteria: - Test cases executed - Defects logged with screenshots - Retest pass after fixes.',
  },
  {
    ticketNo: 'INST-191',
    createdDate: '2025-09-14',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Backend: Drill-down report API (filters, sorting, pagination)',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement report API supporting filter parameters, sorting, pagination, and export compatibility. Ensure RBAC filters data by role/team. Acceptance Criteria: - Response includes total count - Query performance optimized - Permission filtering validated.',
  },
  {
    ticketNo: 'INST-192',
    createdDate: '2025-09-15',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'QA: Communications status + retry testing',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Validate message status updates and retry behavior across failure scenarios (provider down, invalid number). Acceptance Criteria: - Status transitions correct - Retry does not duplicate messages - Audit log updated.',
  },
  {
    ticketNo: 'INST-193',
    createdDate: '2025-09-15',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Figma: Saved views UX (dropdown + manage modal)',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Design saved views dropdown and manage modal including rename/delete flows and empty states. Acceptance Criteria: - Clear interaction notes - Responsive behavior - Component variants.',
  },
  {
    ticketNo: 'INST-194',
    createdDate: '2025-09-16',
    sprintId: '6935b45d95e8c7b36698b11d',
    title: 'Figma: Drill-down report table interactions + export UX',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design report table interactions: sorting indicators, filter chips, export menu, column selection, and inline empty/error states. Acceptance Criteria: - Interaction annotations - Component variants - Responsive behavior documented.',
  },
  {
    ticketNo: 'INST-195',
    createdDate: '2025-09-18',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'React: Template library (CRUD + search)',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Build template library UI with CRUD, search, tags, and preview panel. Integrate with APIs. Acceptance Criteria: - Optimistic updates - Validation messages - Permission checks enforced.',
  },
  {
    ticketNo: 'INST-196',
    createdDate: '2025-09-18',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'React: Analytics attribution widgets (channel split)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Add analytics widgets to display channel split (email/SMS/WhatsApp/chat), response times by channel, and conversion by source. Acceptance Criteria: - Filter aware - Stable rendering - Clear empty/error states.',
  },
  {
    ticketNo: 'INST-197',
    createdDate: '2025-09-19',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Figma: Template library screens',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design template library: list, create/edit, tagging, folder navigation, and preview. Include empty states and validations. Acceptance Criteria: - Full state coverage - Handoff notes - Responsive frames.',
  },
  {
    ticketNo: 'INST-198',
    createdDate: '2025-09-19',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'React: Integrations monitoring UI (status + error log)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Implement monitoring UI: status cards, last sync, errors table with filtering and pagination. Acceptance Criteria: - Admin-only access - Efficient rendering - Links to troubleshooting steps.',
  },
  {
    ticketNo: 'INST-199',
    createdDate: '2025-09-20',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Figma: Integrations monitoring dashboard',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design integrations monitoring dashboard with status cards, detail drawer, and error log table. Acceptance Criteria: - Loading/empty/error states - Clear visual hierarchy - Handoff annotations.',
  },
  {
    ticketNo: 'INST-200',
    createdDate: '2025-09-21',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Requirements: Analytics communications attribution (source tracking)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define requirements to attribute communications and chat activity to lead/source and show impact in analytics (conversion funnels, response time by channel). Acceptance Criteria: - Data fields defined - Stories + AC written - Reporting expectations captured.',
  },
  {
    ticketNo: 'INST-201',
    createdDate: '2025-09-21',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'QA: September full regression sweep (Phase-2 modules)',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Run full regression across September Phase-2 modules: analytics, reports, chat, integrations, templates. Prioritize P0 flows. Acceptance Criteria: - Regression report produced - All P0 defects addressed or triaged - Final smoke sign-off documented.',
  },
  {
    ticketNo: 'INST-202',
    createdDate: '2025-09-22',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Backend: Integrations health endpoints + error logs API',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Implement endpoints for integration health summary and paginated error logs. Include last success timestamps and failure counters. Acceptance Criteria: - Pagination works - No sensitive data in logs - Rate limit protections.',
  },
  {
    ticketNo: 'INST-203',
    createdDate: '2025-09-23',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'QA: Template library functional testing',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Test template CRUD, search, tags, validations, and permission boundaries. Acceptance Criteria: - Test cases executed - Defects logged - Retest passes.',
  },
  {
    ticketNo: 'INST-204',
    createdDate: '2025-09-23',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Sprint Toronto review + Phase-2 readiness checkpoint',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Run sprint review and confirm Phase-2 readiness: outstanding risks, performance hotspots, and UAT planning. Acceptance Criteria: - Risks updated - UAT plan tasks identified - Stakeholder notes captured.',
  },
  {
    ticketNo: 'INST-205',
    createdDate: '2025-09-24',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Figma: Responsive refinements for analytics + inbox (tablet)',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Refine tablet responsive behavior for analytics and communications inbox: spacing, collapsing panels, and sticky filters. Acceptance Criteria: - Tablet frames updated - Clear behavior notes - Consistent component usage.',
  },
  {
    ticketNo: 'INST-206',
    createdDate: '2025-09-25',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Requirements: Communications template management (folders, tags)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define template management requirements: create/edit, folders/tags, search, and approval workflow if needed. Acceptance Criteria: - Stories + AC complete - Roles defined - Edge cases (duplicate names).',
  },
  {
    ticketNo: 'INST-207',
    createdDate: '2025-09-25',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Backend: Template library APIs + validation',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement template CRUD APIs with validation, versioning metadata, and audit entries for changes. Acceptance Criteria: - Input validation - Audit log for changes - Search supported (by name/tag).',
  },
  {
    ticketNo: 'INST-208',
    createdDate: '2025-09-26',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'React: Performance optimization for analytics pages',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Optimize analytics rendering: memoization, virtualized tables where needed, and API request batching. Acceptance Criteria: - Noticeable performance improvement - No regression in UI behavior - Lighthouse/perf notes captured.',
  },
  {
    ticketNo: 'INST-209',
    createdDate: '2025-09-27',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Backend: Attribution fields + event tracking for comms/chat',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement event tracking for communications and chat activities (sent, replied, opened where available) and persist attribution fields for analytics. Acceptance Criteria: - Events stored with timestamps - Linked to lead/contact - Compatible with KPI aggregation.',
  },
  {
    ticketNo: 'INST-210',
    createdDate: '2025-09-27',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Requirements: Integrations monitoring dashboard',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define requirements for integrations monitoring: health status, last sync time, last error, retry controls, and alerting thresholds. Acceptance Criteria: - Monitoring stories created - AC includes error cases - Roles defined (admin-only).',
  },
  {
    ticketNo: 'INST-211',
    createdDate: '2025-09-28',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'QA: Integrations monitoring regression',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Test monitoring dashboard, error logs pagination, and role-based access. Validate no secret leakage. Acceptance Criteria: - Defects logged - Security checks passed - Retest evidence recorded.',
  },
  {
    ticketNo: 'INST-212',
    createdDate: '2025-09-29',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Figma: Attribution charts + funnel layouts',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design funnel and channel-split chart layouts with filter chips and drill-down entry points. Acceptance Criteria: - Component variants - Interaction notes - Responsive frames.',
  },
  {
    ticketNo: 'INST-213',
    createdDate: '2025-09-29',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'Backend: Query optimization for KPI aggregation',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Optimize KPI queries with indexes, pre-aggregation where necessary, and caching. Add monitoring for slow queries. Acceptance Criteria: - Reduced response times - Slow query logging enabled - No KPI discrepancies.',
  },
  {
    ticketNo: 'INST-214',
    createdDate: '2025-09-30',
    sprintId: '6935b45d95e8c7b36698b120',
    title: 'QA: Attribution analytics validation',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Validate attribution metrics using seeded test data. Ensure counts and percentages match expected logic. Acceptance Criteria: - Test evidence captured - Discrepancies logged - Retest passes.',
  },
  {
    ticketNo: 'INST-215',
    createdDate: '2025-10-02',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Backend: Messaging service skeleton + status tracking',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Create messaging service skeleton to send messages via provider adapters. Persist message status lifecycle (queued/sent/delivered/failed) and audit logs.',
  },
  {
    ticketNo: 'INST-216',
    createdDate: '2025-10-02',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'QA: Analytics MVP test suite',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Create and execute test cases for analytics MVP: KPIs, filters, drill-down navigation, role visibility, and error states. Log defects with repro steps and evidence.',
  },
  {
    ticketNo: 'INST-217',
    createdDate: '2025-10-03',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Finalize Phase-2 stories for Analytics MVP',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Convert analytics requirements into implementable user stories (dashboard KPIs, chart widgets, drill-down reports, filters, saved views). Include acceptance criteria, edge cases, role permissions, and data definitions.',
  },
  {
    ticketNo: 'INST-218',
    createdDate: '2025-10-03',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Figma: Integration setup screens (connect/disconnect)',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design integration setup UI: credentials/OAuth connect, status badges, error banners, logs and retry actions.',
  },
  {
    ticketNo: 'INST-219',
    createdDate: '2025-10-04',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Backend: Integration connect/disconnect endpoints',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement secure endpoints to connect/disconnect integrations, validate credentials, store secrets safely, and expose health/status.',
  },
  {
    ticketNo: 'INST-220',
    createdDate: '2025-10-05',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Integration checklist for Email/SMS/WhatsApp providers',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Finalize integration checklist including auth method, rate limits, webhooks, sandbox/testing approach, and rollout plan aligned to Dec delivery.',
  },
  {
    ticketNo: 'INST-221',
    createdDate: '2025-10-05',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'React: Agent chat console (real-time updates)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement agent chat console with polling/WS integration, unread counts, reconnect handling, and transcript view.',
  },
  {
    ticketNo: 'INST-222',
    createdDate: '2025-10-06',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'QA: Messaging send + status scenarios (basic)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Validate send flow and status updates for message lifecycle and failure/retry. Ensure audit log entries exist and permissions enforced.',
  },
  {
    ticketNo: 'INST-223',
    createdDate: '2025-10-07',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'QA: Website chat end-to-end validation',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Test visitor widget to agent console flow, lead creation, transcript storage, reconnect behavior, and offline fallback. Validate edge cases and performance.',
  },
  {
    ticketNo: 'INST-224',
    createdDate: '2025-10-07',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Figma: Unified inbox + composer (v1)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design inbox thread list + conversation view + composer with template selector, attachment UI, delivery indicators, and permission states.',
  },
  {
    ticketNo: 'INST-225',
    createdDate: '2025-10-08',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'React: Integration setup screens implementation',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Build integration setup pages and status UI; wire endpoints; show validation errors; ensure admin-only access.',
  },
  {
    ticketNo: 'INST-226',
    createdDate: '2025-10-09',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Communications module story breakdown (Inbox + Composer)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Write user stories for unified inbox, conversation threads, composer (templates, attachments), delivery statuses, retries, opt-out and audit logging.',
  },
  {
    ticketNo: 'INST-227',
    createdDate: '2025-10-09',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'QA: Integration setup smoke tests',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Execute smoke testing for connect/disconnect flows, validation errors, status display, and permission checks.',
  },
  {
    ticketNo: 'INST-228',
    createdDate: '2025-10-10',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Backend: KPI aggregation endpoints (v1)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement backend endpoints to compute KPI cards and time-series for charts. Include permission-based filtering, caching, and standardized error responses.',
  },
  {
    ticketNo: 'INST-229',
    createdDate: '2025-10-11',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Phase-2 Definition of Done + quality gates',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define Definition of Done for Phase-2 tickets (unit tests, QA sign-off, performance checks, accessibility basics) and document quality gates to meet Dec week-1 delivery.',
  },
  {
    ticketNo: 'INST-230',
    createdDate: '2025-10-11',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Figma: Analytics dashboard (high-fidelity + states)',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Create high-fidelity Figma for analytics overview page with KPI cards, charts, filters and saved views. Include empty/loading/error states and responsive frames (1440/1024).',
  },
  {
    ticketNo: 'INST-231',
    createdDate: '2025-10-12',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'React: Analytics dashboard rendering (v1)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Build analytics dashboard page in React, render KPI cards and charts from APIs, implement skeleton loaders, error toasts, and filter interactions.',
  },
  {
    ticketNo: 'INST-232',
    createdDate: '2025-10-13',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'React: Inbox UI (v1) with send flow',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Build inbox UI and composer; integrate send API; show optimistic status updates; handle failures with retry and clear error messaging.',
  },
  {
    ticketNo: 'INST-233',
    createdDate: '2025-10-13',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Backend: Chat routing + transcript persistence',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement chat routing rules (queue/agent assignment) and persist chat transcripts with session metadata. Ensure reconnect and idempotency.',
  },
  {
    ticketNo: 'INST-234',
    createdDate: '2025-10-14',
    sprintId: '6935b45d95e8c7b36698b123',
    title: 'Figma: Website chat agent console UI',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design agent console chat UI (conversation list, active chat, quick replies, assignment indicators) with states for offline/hand-off/error.',
  },
  {
    ticketNo: 'INST-235',
    createdDate: '2025-10-16',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Figma: Integration logs viewer UI',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design logs viewer table, filters, details drawer, and empty/error states.',
  },
  {
    ticketNo: 'INST-236',
    createdDate: '2025-10-16',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Figma: Template manager screens',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design template manager screens: list, create/edit, placeholder helper, preview, and approval states.',
  },
  {
    ticketNo: 'INST-237',
    createdDate: '2025-10-17',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Analytics drill-down requirements + export rules',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define drill-down report requirements: columns, sorting, pagination, export limits, and permission rules. Document expected CSV format and edge cases.',
  },
  {
    ticketNo: 'INST-238',
    createdDate: '2025-10-18',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Communications: templates + approvals workflow',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define messaging templates workflow (create/edit/approve), template categories, placeholders, and approvals/permissions.',
  },
  {
    ticketNo: 'INST-239',
    createdDate: '2025-10-18',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'QA: Drill-down + export regression tests',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Execute regression tests for drill-down flows and export outputs. Validate consistency across filters, roles, and large datasets.',
  },
  {
    ticketNo: 'INST-240',
    createdDate: '2025-10-19',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'React: Integration logs viewer',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Build admin UI to view integration logs, filter by provider/status, and surface actionable errors.',
  },
  {
    ticketNo: 'INST-241',
    createdDate: '2025-10-20',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'React: Template manager UI',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Build template manager UI; integrate CRUD APIs; add validation, preview, and approval status indicators.',
  },
  {
    ticketNo: 'INST-242',
    createdDate: '2025-10-20',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'QA: SLA rule scenarios',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Test SLA timers, breach notifications, and escalation behavior across online/offline cases.',
  },
  {
    ticketNo: 'INST-243',
    createdDate: '2025-10-21',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Backend: Templates API + placeholder rendering',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement templates CRUD APIs, placeholder rendering engine, validation rules, and audit logging for changes.',
  },
  {
    ticketNo: 'INST-244',
    createdDate: '2025-10-22',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'QA: Webhook + status update tests',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Validate that webhook events update message statuses correctly and logs are searchable; test failure paths.',
  },
  {
    ticketNo: 'INST-245',
    createdDate: '2025-10-23',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'React: Drill-down table enhancements',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Enhance drill-down tables: column chooser, persistent filters, export progress UI, and accessibility improvements.',
  },
  {
    ticketNo: 'INST-246',
    createdDate: '2025-10-23',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Integrations: webhook event mapping document',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Document webhook event mapping for providers (delivery receipts, inbound messages) and mapping to CRM entities.',
  },
  {
    ticketNo: 'INST-247',
    createdDate: '2025-10-24',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'QA: Template workflow validation',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Test template creation/edit/approval, placeholder validation, permissions, and audit logs.',
  },
  {
    ticketNo: 'INST-248',
    createdDate: '2025-10-25',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Figma: Drill-down table UX refinements',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Refine drill-down UX in Figma: table density, column controls, export affordances, and mobile/tablet behavior.',
  },
  {
    ticketNo: 'INST-249',
    createdDate: '2025-10-25',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Chat: SLA + assignment rules refinement',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Define SLA rules (response time thresholds), assignment fallback, and escalation actions for missed SLAs.',
  },
  {
    ticketNo: 'INST-250',
    createdDate: '2025-10-26',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Backend: SLA monitoring + notifications',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement SLA monitoring job and notifications/events when thresholds breached. Ensure escalation and logs.',
  },
  {
    ticketNo: 'INST-251',
    createdDate: '2025-10-27',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Backend: Drill-down reports API + CSV export hardening',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Implement drill-down APIs with pagination, sorting, and CSV export (async/streaming if needed). Add safeguards for large exports and consistent headers.',
  },
  {
    ticketNo: 'INST-252',
    createdDate: '2025-10-27',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Backend: Webhook handlers + idempotency',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Implement webhook handlers with idempotency keys, retries, and logging. Map events into message status updates.',
  },
  {
    ticketNo: 'INST-253',
    createdDate: '2025-10-28',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'Figma: SLA indicators + escalation UI',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design SLA indicators, breach banners, and escalation UI patterns consistent with design system.',
  },
  {
    ticketNo: 'INST-254',
    createdDate: '2025-10-29',
    sprintId: '6935b45d95e8c7b36698b126',
    title: 'React: SLA indicators in agent console',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Add SLA countdown/indicators, breach banners, and escalation prompts in agent console UI.',
  },
  {
    ticketNo: 'INST-255',
    createdDate: '2025-10-30',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Figma: Messaging failure states & toasts',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Design failure/queued/toast patterns for messaging flows; include content guidelines for errors.',
  },
  {
    ticketNo: 'INST-256',
    createdDate: '2025-10-30',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Figma: Audit log viewer refinements',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Refine audit log viewer UI and detail drawer layout; add empty/loading/error states.',
  },
  {
    ticketNo: 'INST-257',
    createdDate: '2025-10-31',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Release scope lock for Dec week-1 delivery',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Lock release scope for Phase 2 delivery (Dec week-1). Confirm P0/P1 backlog, dependencies, and sign-off plan.',
  },
  {
    ticketNo: 'INST-258',
    createdDate: '2025-11-01',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Accessibility & UX acceptance checklist for Phase-2',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Create an accessibility and UX acceptance checklist for Phase-2 screens (keyboard navigation, focus order, aria labels, contrast, error messaging). Review key screens with design/dev and log required fixes to meet Dec week-1 delivery.',
  },
  {
    ticketNo: 'INST-259',
    createdDate: '2025-11-01',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'React: Admin audit log viewer improvements',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Enhance audit log viewer: filters, event detail drawer, export support, and role restrictions.',
  },
  {
    ticketNo: 'INST-260',
    createdDate: '2025-11-02',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Backend: Hardening messaging retries + rate limits',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Improve retry strategy, idempotency, and rate-limit handling for messaging providers; add better error classification.',
  },
  {
    ticketNo: 'INST-261',
    createdDate: '2025-11-03',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Figma: Final polish + consistency pass',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Run UI consistency pass: spacing, typography, component alignment, error states, and microcopy across new modules.',
  },
  {
    ticketNo: 'INST-262',
    createdDate: '2025-11-03',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Backend: Performance tuning for analytics queries',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Profile and optimize slow analytics queries; add indexes/caching; verify under realistic load.',
  },
  {
    ticketNo: 'INST-263',
    createdDate: '2025-11-04',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'QA: Smoke tests for release candidate',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Run smoke tests on RC build for critical flows and capture evidence for release readiness.',
  },
  {
    ticketNo: 'INST-264',
    createdDate: '2025-11-05',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Backend: Health checks + monitoring endpoints',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Add health endpoints, provider connectivity checks, and metrics for dashboards; integrate with monitoring tools.',
  },
  {
    ticketNo: 'INST-265',
    createdDate: '2025-11-06',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'React: Performance optimizations for dashboards',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Optimize rendering (memoization, virtualization for tables), reduce API calls, and improve initial load time.',
  },
  {
    ticketNo: 'INST-266',
    createdDate: '2025-11-06',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Backend: Audit log coverage expansion',
    size: 8,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Ensure audit logs cover messaging sends, template changes, integration connects, and admin actions.',
  },
  {
    ticketNo: 'INST-267',
    createdDate: '2025-11-07',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'QA: Full regression suite for Phase-2 modules',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Run full regression across analytics, communications, chat and integrations. Track pass/fail, re-test fixes, and prepare release report.',
  },
  {
    ticketNo: 'INST-268',
    createdDate: '2025-11-08',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'React: Health status badges on admin pages',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Show health badges for integrations and services on admin pages; display last check time and guidance.',
  },
  {
    ticketNo: 'INST-269',
    createdDate: '2025-11-08',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'QA: Cross-browser + responsive verification',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Validate Phase-2 screens on major browsers and responsive breakpoints; log UI regressions and verify fixes.',
  },
  {
    ticketNo: 'INST-270',
    createdDate: '2025-11-09',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Go-live runbook draft (rollback/monitoring)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Draft go-live runbook: deployment steps, rollback plan, monitoring checks, and incident contacts.',
  },
  {
    ticketNo: 'INST-271',
    createdDate: '2025-11-10',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'QA: Audit log verification',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Validate audit log entries are created correctly for key actions and are viewable with correct permissions.',
  },
  {
    ticketNo: 'INST-272',
    createdDate: '2025-11-10',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'UAT plan + stakeholder sign-off checklist',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Prepare UAT plan, entry/exit criteria, sign-off checklist, and communication plan for release.',
  },
  {
    ticketNo: 'INST-273',
    createdDate: '2025-11-11',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'Figma: Integration health badge components',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Design health badges (ok/warn/fail), tooltip copy, and admin banner patterns.',
  },
  {
    ticketNo: 'INST-274',
    createdDate: '2025-11-12',
    sprintId: '6935b45d95e8c7b36698b129',
    title: 'React: Messaging failure UX (retry/queue)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Improve UX for message failures: retry button, queued state, toast messaging, and clear reasons for failure.',
  },
  {
    ticketNo: 'INST-275',
    createdDate: '2025-11-13',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Critical bug triage & prioritization',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-276',
    createdDate: '2025-11-13',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Fix analytics KPI mismatch issues',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-277',
    createdDate: '2025-11-14',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'UI alignment fixes across dashboards',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-278',
    createdDate: '2025-11-14',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Resolve website chat message delay bug',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-279',
    createdDate: '2025-11-15',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Regression testing - analytics & chat',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-280',
    createdDate: '2025-11-15',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Fix export CSV formatting issues',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-281',
    createdDate: '2025-11-16',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Stability fixes for integrations auth',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-282',
    createdDate: '2025-11-16',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Improve error logging & monitoring',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-283',
    createdDate: '2025-11-17',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'Fix role-based access edge cases',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-284',
    createdDate: '2025-11-17',
    sprintId: '6935b45d95e8c7b36698b12c',
    title: 'UAT bug fixes - round 1',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Bug-fix focused task for Phase 2 stabilization. Address reported issues, validate fix, add regression coverage where applicable. Target stability for Dec 20 delivery.',
  },
  {
    ticketNo: 'INST-285',
    createdDate: '2025-11-27',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'UAT bug fixes - round 2',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-286',
    createdDate: '2025-11-27',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Performance tuning - analytics dashboards',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-287',
    createdDate: '2025-11-28',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Fix intermittent chat disconnects',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-288',
    createdDate: '2025-11-28',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Polish UI inconsistencies & spacing',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-289',
    createdDate: '2025-11-29',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Integration retry & timeout fixes',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-290',
    createdDate: '2025-11-29',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Final regression testing',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '693492b2bcacb97acd2fa9a4',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-291',
    createdDate: '2025-11-30',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Release readiness checklist',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349296bcacb97acd2fa98e',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-292',
    createdDate: '2025-11-30',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Fix remaining P2/P3 defects',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '693492d3bcacb97acd2fa9b1',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-293',
    createdDate: '2025-12-01',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'User acceptance support & fixes',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-294',
    createdDate: '2025-12-01',
    sprintId: '6935b45d95e8c7b36698b12f',
    title: 'Production release sign-off',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '6934938ebcacb97acd2fa9d8',
    description:
      'Final stabilization and readiness task to ensure InstaCRM Phase 2 meets delivery criteria by Dec 20. Includes verification, fixes, and sign-off.',
  },
  {
    ticketNo: 'INST-295',
    createdDate: '2025-12-11',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'UAT feedback triage & prioritization',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Review consolidated UAT feedback from stakeholders, classify issues by severity (P0/P1/P2), identify quick wins vs risky changes, and finalize fix scope for the final delivery window before Dec 20.',
  },
  {
    ticketNo: 'INST-296',
    createdDate: '2025-12-11',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'Fix critical analytics discrepancies',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Resolve critical analytics issues reported during UAT, including KPI mismatches, rounding errors, and incorrect date filtering. Ensure fixes are validated against source data.',
  },
  {
    ticketNo: 'INST-297',
    createdDate: '2025-12-12',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'UI fixes from UAT feedback',
    size: 3,
    status: TaskStatus.DONE,
    assigneeUserId: '6934938ebcacb97acd2fa9d8',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Apply UI improvements based on UAT feedback such as spacing issues, alignment problems, labeling clarity, and minor usability enhancements across dashboards and inbox screens.',
  },
  {
    ticketNo: 'INST-298',
    createdDate: '2025-12-12',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'Chat reliability fixes (P0 issues)',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492b2bcacb97acd2fa9a4',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Fix high-priority chat issues identified in UAT including delayed message rendering, reconnect failures, and unread count inconsistencies in the agent console.',
  },
  {
    ticketNo: 'INST-299',
    createdDate: '2025-12-13',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'Integration failure handling improvements',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '69349296bcacb97acd2fa98e',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Improve error handling for third-party integrations based on UAT findings, including clearer error messages, retry stability, and timeout handling.',
  },
  {
    ticketNo: 'INST-300',
    createdDate: '2025-12-16',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'Regression testing after UAT fixes',
    size: 5,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Perform focused regression testing after UAT fixes covering analytics, communications, chat, and integrations to ensure no existing functionality is broken.',
  },
  {
    ticketNo: 'INST-301',
    createdDate: '2025-12-18',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'Final UAT sign-off validation',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '693492d3bcacb97acd2fa9b1',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Validate that all agreed UAT feedback items are addressed and confirmed by stakeholders. Capture final approval for Phase-2 delivery.',
  },
  {
    ticketNo: 'INST-302',
    createdDate: '2025-12-19',
    sprintId: '6935b45d95e8c7b36698b132',
    title: 'Production delivery readiness & handover',
    size: 2,
    status: TaskStatus.DONE,
    assigneeUserId: '69349310bcacb97acd2fa9be',
    createdByUserId: '69349310bcacb97acd2fa9be',
    description:
      'Complete final delivery checklist including documentation, known limitations, monitoring readiness, rollback plan, and formal handover for InstaCRM Phase-2 release.',
  },
];

const addWorkingDays = (start: Date, workingDays: number) => {
  const date = new Date(start);
  let added = 0;

  while (added < workingDays) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }

  return date;
};

const randomWorkingDays = (min: number, max: number) => {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
};

const subtractWorkingDays = (start: Date, workingDays: number) => {
  const date = new Date(start);
  let removed = 0;

  while (removed < workingDays) {
    date.setDate(date.getDate() - 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      removed++;
    }
  }

  return date;
};

const ensureWorkspaceAndProject = async () => {
  const workspace = await WorkspaceModel.findById(WORKSPACE_ID).exec();
  if (!workspace) {
    throw new Error(`Workspace ${WORKSPACE_ID} not found.`);
  }

  const project = await ProjectModel.findById(PROJECT_ID).exec();
  if (!project) {
    throw new Error(`Project ${PROJECT_ID} not found.`);
  }
};

const ensureSprints = async () => {
  const ticketsBySprint = new Map<string, TicketSeed[]>();

  for (const ticket of TICKETS) {
    if (!ticketsBySprint.has(ticket.sprintId)) {
      ticketsBySprint.set(ticket.sprintId, []);
    }

    ticketsBySprint.get(ticket.sprintId)!.push(ticket);
  }

  for (const [sprintId, tickets] of ticketsBySprint.entries()) {
    const existing = await SprintModel.findById(sprintId).exec();
    if (existing) continue;

    const createdDates = tickets.map((ticket) => new Date(ticket.createdDate));
    const startDate = new Date(Math.min(...createdDates.map((date) => date.getTime())));
    const endDate = addWorkingDays(new Date(Math.max(...createdDates.map((date) => date.getTime()))), 15);

    await SprintModel.create({
      _id: sprintId,
      workspaceId: WORKSPACE_ID,
      name: `${DEFAULT_SPRINT_NAME} (${sprintId.slice(-4)})`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }
};

const ensureMembers = async (userIds: string[]) => {
  const userDocs = await UserModel.find({ _id: { $in: userIds } }).exec();
  const userMap = new Map(userDocs.map((doc) => [doc._id.toString(), doc]));

  const missingUsers = userIds.filter((id) => !userMap.has(id));
  if (missingUsers.length) {
    throw new Error(`Missing users: ${missingUsers.join(', ')}`);
  }

  const members = await MemberModel.find({ workspaceId: WORKSPACE_ID, userId: { $in: userIds } }).exec();
  const memberMap = new Map(members.map((doc) => [doc.userId, doc]));

  for (const userId of userIds) {
    if (memberMap.has(userId)) continue;

    const member = await MemberModel.create({
      workspaceId: WORKSPACE_ID,
      userId,
      role: MemberRole.MEMBER,
    });

    memberMap.set(userId, member);
  }

  return memberMap;
};

const seedTickets = async () => {
  await connectToDatabase();
  await ensureWorkspaceAndProject();
  await ensureSprints();

  const userIds = Array.from(
    new Set(TICKETS.flatMap((ticket) => [ticket.assigneeUserId, ticket.createdByUserId])),
  );
  const memberMap = await ensureMembers(userIds);

  let position = 1000;
  let created = 0;
  let updated = 0;

  for (const ticket of TICKETS) {
    const assigneeMember = memberMap.get(ticket.assigneeUserId);
    const createdByMember = memberMap.get(ticket.createdByUserId);

    if (!assigneeMember || !createdByMember) {
      throw new Error(`Missing member for ticket ${ticket.ticketNo}`);
    }

    const baseDate = new Date(ticket.createdDate);
    const dueDate = addWorkingDays(baseDate, randomWorkingDays(1, 15));
    const createdOn = subtractWorkingDays(dueDate, randomWorkingDays(5, 15));
    const name = `${ticket.ticketNo}: ${ticket.title}`;

    const existing = await TaskModel.findOne({
      workspaceId: WORKSPACE_ID,
      projectId: PROJECT_ID,
      name,
    }).exec();

    if (existing) {
      existing.status = ticket.status;
      existing.assigneeId = assigneeMember._id.toString();
      existing.createdById = createdByMember._id.toString();
      existing.dueDate = dueDate.toISOString();
      existing.createdOn = createdOn.toISOString();
      existing.sprintId = ticket.sprintId;
      existing.type = TaskType.TASK;
      existing.description = ticket.description;
      await existing.save();
      updated++;
      continue;
    }

    await TaskModel.create({
      name,
      status: ticket.status,
      type: TaskType.TASK,
      assigneeId: assigneeMember._id.toString(),
      createdById: createdByMember._id.toString(),
      projectId: PROJECT_ID,
      workspaceId: WORKSPACE_ID,
      position,
      dueDate: dueDate.toISOString(),
      createdOn: createdOn.toISOString(),
      sprintId: ticket.sprintId,
      description: ticket.description,
    });

    position += 1000;
    created++;
  }

  console.log(`Seeded tickets: ${created} created, ${updated} updated.`);
};

seedTickets()
  .then(() => {
    console.log('Ticket seeding complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed tickets', error);
    process.exit(1);
  });
