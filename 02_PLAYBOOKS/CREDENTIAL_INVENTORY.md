---
id: 02_playbooks__credential_inventory_md
title: Credential Inventory
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Credential Inventory

**Version:** 1.0
**Last Updated:** 2026-01-27
**Status:** Active (Stage 2.1)

---

## Overview

This document inventories all credentials required for the Levine Law Second Brain system. It documents credential names, sources, and rotation procedures—**not credential values**.

**Security Note:** Actual credential values are stored in `.env` (local only, not committed).

---

## Credential Categories

### Stage 2.1 (Current)

No external credentials required. Agents operate in read-only mode against local repository.

| Credential | Required | Status |
|------------|----------|--------|
| Repository access | No | Claude Code has native access |
| External API tokens | No | Stage 2.1 is local-only |

### Stage 2.2 (Future: Integration Activation)

| Credential | Source | Purpose | Rotation |
|------------|--------|---------|----------|
| `GMAIL_CLIENT_ID` | Google Cloud Console | OAuth app identifier | On compromise |
| `GMAIL_CLIENT_SECRET` | Google Cloud Console | OAuth app secret | On compromise |
| `GMAIL_REFRESH_TOKEN` | OAuth flow | User authorization | On revocation |
| `AZURE_CLIENT_ID` | Azure Portal | App registration | On compromise |
| `AZURE_CLIENT_SECRET` | Azure Portal | App secret | 90 days |
| `AZURE_TENANT_ID` | Azure Portal | Tenant identifier | Never (static) |

---

## Environment Variables Template

Located at: `.env.example`

```bash
# .env.example — Copy to .env and fill in values
# NEVER commit .env to version control

# === Repository Access ===
# (Claude Code has native repo access, no token needed)

# === Gmail Integration (Stage 2.2) ===
# GMAIL_CLIENT_ID=
# GMAIL_CLIENT_SECRET=
# GMAIL_REFRESH_TOKEN=

# === Microsoft Graph Integration (Stage 2.2) ===
# AZURE_CLIENT_ID=
# AZURE_CLIENT_SECRET=
# AZURE_TENANT_ID=

# === Agent Configuration ===
# CLAUDE_MODEL=claude-sonnet-4-20250514
```

---

## Credential Sources

### Google Cloud Console (Gmail)

**URL:** https://console.cloud.google.com/
**Project:** Levine Law Second Brain (or designated project)

**Steps to obtain:**
1. Create OAuth 2.0 Client ID (Desktop app type)
2. Download client configuration
3. Extract `client_id` and `client_secret`
4. Run OAuth flow to obtain `refresh_token`

**Required Scopes:**
- `https://www.googleapis.com/auth/gmail.readonly`

### Azure Portal (SharePoint/Word)

**URL:** https://portal.azure.com/
**App Registration:** Levine Law Second Brain

**Steps to obtain:**
1. Register application in Azure AD
2. Note `Application (client) ID` → `AZURE_CLIENT_ID`
3. Note `Directory (tenant) ID` → `AZURE_TENANT_ID`
4. Create client secret → `AZURE_CLIENT_SECRET`

**Required Permissions:**
- `Sites.Read.All` (SharePoint)
- `Files.Read` (OneDrive/Word)

---

## Rotation Procedures

### Scheduled Rotation

| Credential | Rotation Frequency | Procedure |
|------------|-------------------|-----------|
| `AZURE_CLIENT_SECRET` | 90 days | 1. Create new secret in Azure Portal<br>2. Update `.env`<br>3. Delete old secret |
| `GMAIL_REFRESH_TOKEN` | On revocation | 1. Re-run OAuth flow<br>2. Update `.env` |

### Emergency Rotation (On Compromise)

1. **Immediately revoke** compromised credential at source
2. **Generate new credential** following source procedures
3. **Update `.env`** with new value
4. **Verify functionality** by running agent test
5. **Document incident** in security log

---

## Security Controls

### Storage

- **Local `.env` file:** Not committed to repository
- **`.gitignore`:** Contains `.env` entry
- **Safety rails:** Script validates `.env` not tracked

### Access

- **ML1 only:** Credential management is ML1 responsibility
- **Agents cannot:** Create, store, or modify credentials
- **No credential references:** Agent definitions must not contain credential values

### Audit

- **Quarterly review:** Verify credential inventory accuracy
- **Access logs:** Monitor API usage for anomalies
- **Rotation compliance:** Track rotation dates

---

## Verification Checklist

Before activating integrations (Stage 2.2):

- [ ] All required credentials obtained
- [ ] `.env` file created (not committed)
- [ ] `.env.example` updated with new variables
- [ ] `.gitignore` includes `.env`
- [ ] Safety rails script passes
- [ ] Credential sources documented
- [ ] Rotation procedures documented
- [ ] ML1 approval obtained

---

## Related Documents

- Write-Back Policy: `01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md`
- Agent Deployment Guide: `00_SYSTEM/AGENTS/deployment/AGENT_DEPLOYMENT_GUIDE.md`
- Safety Rails Script: `scripts/safety-rails.sh`
- Environment Template: `.env.example`
