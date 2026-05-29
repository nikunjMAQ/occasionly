# Synchronization Lifecycle Spec

This document details the sequence flow, offline queuing lifecycle, and conflict resolution rules of the **Sync Domain**.

---

## 1. Sequence Diagram

```mermaid
sequenceDiagram
  autonumber
  actor User as UI / Component
  participant Dexie as Dexie IndexedDB
  participant Queue as Sync Queue Manager
  participant Supabase as Supabase Cloud

  User->>Dexie: Add/Update Event (Instant save)
  Dexie->>User: Renders state instantly (16ms)
  Dexie->>Queue: Push Action Payload (version: version + 1)
  Note over Queue: Queue status: [pending]
  
  alt Device is Offline
    Queue->>Queue: Stop and wait for online event trigger
  else Device is Online
    Queue->>Supabase: POST /tables/events (Upsert data)
    alt Sync Successful
      Supabase->>Queue: 200 OK (upserted record)
      Queue->>Dexie: Clear Queue entry
      Queue->>User: Broadcast "Synced successfully" status
    else Conflict Detected
      Supabase->>Queue: Version Mismatch (409)
      Queue->>Queue: Trigger LWW Conflict Resolution
      Queue->>Dexie: Resolve with high version, log in `conflicts`
    end
  end
```

---

## 2. Sync Queue State Model
The offline sync queue tracks events through four core states:
- **`idle`**: No actions pending. Sync is verified.
- **`pending`**: Action created locally and queued. Waiting for worker trigger.
- **`syncing`**: Network payload is currently flying to Supabase cloud.
- **`error`**: Network timeout, offline state, or server error. Will retry on reconnect.

---

## 3. Conflict Resolution Algorithm (Last-Write-Wins)
When syncing or pulling records from Supabase:
1. Compare `cloud_version` vs `local_version`.
2. If `cloud_version > local_version`:
   - Cloud record is considered authoritative.
   - Local Dexie record is overwritten.
   - A `ConflictLog` is created locally.
3. If `cloud_version < local_version`:
   - Local record is considered authoritative.
   - Sync Queue pushes local state to cloud.
4. If `cloud_version == local_version`:
   - Fall back to the latest `updatedAt` ISO date string.
