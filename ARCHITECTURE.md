# Data Model

| TABLE | KEY COLUMNS | RELATIONS | ORG-SCOPED? |
|-------|-------------|-----------|--------------|
| organizations | id, name, slug | hasMany users, tickets | IS the scope root |
| users | id, org_id, name, email, role | belongsTo org | YES - org_id FK |
| tickets | id, org_id, subject, status, priority, requester_id, assignee_id, sla_due_at | belongsTo org, requester, assignee | YES - org_id FK |
| comments | id, org_id, ticket_id, user_id, body, is_internal | belongsTo ticket, user | YES - org_id FK |
| sla_policies | id, org_id, priority, response_hours, resolution_hours | belongsTo org | YES - org_id FK |
| ticket_activities | id, org_id, ticket_id, user_id, action, meta | belongsTo ticket | YES - org_id FK |

## Multi-Tenancy Approach

- Every table has an `organization_id` foreign key
- Every query is scoped: `where('organization_id', auth()->user()->organization_id)`
- Policies double-check: `$user->organization_id === $resource->organization_id`
- Tenant is derived from the authenticated user's session - NEVER from a client-supplied parameter

# API Routes Reference

| METHOD | ENDPOINT | DESCRIPTION | AUTH |
|--------|----------|-------------|------|
| POST | /api/register | Register new user | No |
| POST | /api/login | Login → returns token | No |
| POST | /api/logout | Logout (invalidate token) | Yes |
| GET | /api/me | Get authenticated user | Yes |
| GET | /api/tickets | List tickets (filterable) | Yes |
| POST | /api/tickets | Create ticket | Yes |
| GET | /api/tickets/{id} | Get single ticket | Yes |
| PATCH | /api/tickets/{id} | Update ticket | Yes |
| DELETE | /api/tickets/{id} | Delete ticket (admin) | Yes |
| GET | /api/tickets/{id}/comments | List comments | Yes |
| POST | /api/tickets/{id}/comments | Add comment/reply | Yes |
| PATCH | /api/tickets/{id}/assign | Assign/reassign | Yes |
| GET | /api/dashboard | Dashboard metrics | Yes |
| GET | /api/users | List org users | Yes |
