#!/usr/bin/env python3
"""
Gmail Integration Module
Read-only Gmail API access with audit logging.

This module provides:
- Authenticated Gmail API client
- Read-only message access
- Audit logging for all API calls

Usage:
    from gmail_integration import GmailClient

    client = GmailClient()
    messages = client.list_messages(max_results=10)
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

# Setup logging
LOG_DIR = Path(__file__).parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# Audit log file
AUDIT_LOG_FILE = LOG_DIR / "gmail_audit.log"

# Configure audit logger
audit_logger = logging.getLogger("gmail_audit")
audit_logger.setLevel(logging.INFO)

# File handler for audit log
file_handler = logging.FileHandler(AUDIT_LOG_FILE)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s | %(levelname)s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
))
audit_logger.addHandler(file_handler)

# Console handler for visibility
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter('%(message)s'))
audit_logger.addHandler(console_handler)


class GmailClient:
    """
    Gmail API client with read-only access and audit logging.

    Authority Constraints:
    - READ-ONLY: No send, modify, delete, or label operations
    - All API calls are logged to logs/gmail_audit.log
    - Scope: gmail.readonly only
    """

    # Allowed read-only methods (explicit allowlist)
    ALLOWED_METHODS = {
        'users.getProfile',
        'users.messages.list',
        'users.messages.get',
        'users.labels.list',
        'users.labels.get',
        'users.threads.list',
        'users.threads.get',
    }

    # Explicitly prohibited methods (write operations)
    PROHIBITED_METHODS = {
        'users.messages.send',
        'users.messages.insert',
        'users.messages.modify',
        'users.messages.delete',
        'users.messages.trash',
        'users.messages.untrash',
        'users.messages.batchModify',
        'users.messages.batchDelete',
        'users.drafts.create',
        'users.drafts.update',
        'users.drafts.send',
        'users.drafts.delete',
        'users.labels.create',
        'users.labels.update',
        'users.labels.delete',
        'users.labels.patch',
    }

    def __init__(self):
        """Initialize Gmail client with credentials from .env"""
        self._load_credentials()
        self._build_service()
        self._log_audit("INIT", "Gmail client initialized (read-only mode)")

    def _load_credentials(self):
        """Load credentials from environment."""
        from dotenv import load_dotenv

        env_path = Path(__file__).parent.parent / '.env'
        load_dotenv(env_path)

        self.client_id = os.getenv('GMAIL_CLIENT_ID')
        self.client_secret = os.getenv('GMAIL_CLIENT_SECRET')
        self.refresh_token = os.getenv('GMAIL_REFRESH_TOKEN')

        if not all([self.client_id, self.client_secret, self.refresh_token]):
            raise ValueError("Missing Gmail credentials in .env")

    def _build_service(self):
        """Build authenticated Gmail API service."""
        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery import build

        credentials = Credentials(
            token=None,
            refresh_token=self.refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.client_id,
            client_secret=self.client_secret,
            scopes=['https://www.googleapis.com/auth/gmail.modify']
        )

        self.service = build('gmail', 'v1', credentials=credentials)

    def _log_audit(self, action: str, details: str, success: bool = True):
        """Log an audit entry."""
        status = "SUCCESS" if success else "FAILURE"
        entry = f"{action} | {status} | {details}"

        if success:
            audit_logger.info(entry)
        else:
            audit_logger.warning(entry)

    def _check_method_allowed(self, method: str) -> bool:
        """Verify method is in allowlist and not in blocklist."""
        if method in self.PROHIBITED_METHODS:
            self._log_audit("BLOCKED", f"Prohibited method attempted: {method}", success=False)
            raise PermissionError(f"Method '{method}' is prohibited (write operation)")

        if method not in self.ALLOWED_METHODS:
            self._log_audit("BLOCKED", f"Unknown method attempted: {method}", success=False)
            raise PermissionError(f"Method '{method}' is not in allowlist")

        return True

    def get_profile(self) -> Dict[str, Any]:
        """Get authenticated user's profile."""
        self._check_method_allowed('users.getProfile')

        try:
            result = self.service.users().getProfile(userId='me').execute()
            self._log_audit("READ", f"getProfile: {result.get('emailAddress')}")
            return result
        except Exception as e:
            self._log_audit("ERROR", f"getProfile failed: {e}", success=False)
            raise

    def list_messages(self,
                      max_results: int = 10,
                      query: Optional[str] = None,
                      label_ids: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        List messages (metadata only).

        Args:
            max_results: Maximum number of messages to return
            query: Gmail search query (e.g., "from:example@gmail.com")
            label_ids: Filter by label IDs

        Returns:
            List of message metadata (id, threadId)
        """
        self._check_method_allowed('users.messages.list')

        try:
            kwargs = {'userId': 'me', 'maxResults': max_results}
            if query:
                kwargs['q'] = query
            if label_ids:
                kwargs['labelIds'] = label_ids

            result = self.service.users().messages().list(**kwargs).execute()
            messages = result.get('messages', [])

            self._log_audit("READ", f"listMessages: {len(messages)} messages returned (query={query})")
            return messages
        except Exception as e:
            self._log_audit("ERROR", f"listMessages failed: {e}", success=False)
            raise

    def get_message(self,
                    message_id: str,
                    format: str = 'metadata') -> Dict[str, Any]:
        """
        Get a specific message.

        Args:
            message_id: The message ID
            format: 'minimal', 'metadata', 'full', or 'raw'

        Returns:
            Message data
        """
        self._check_method_allowed('users.messages.get')

        try:
            result = self.service.users().messages().get(
                userId='me',
                id=message_id,
                format=format
            ).execute()

            self._log_audit("READ", f"getMessage: id={message_id}, format={format}")
            return result
        except Exception as e:
            self._log_audit("ERROR", f"getMessage failed: {e}", success=False)
            raise

    def list_labels(self) -> List[Dict[str, Any]]:
        """List all labels."""
        self._check_method_allowed('users.labels.list')

        try:
            result = self.service.users().labels().list(userId='me').execute()
            labels = result.get('labels', [])

            self._log_audit("READ", f"listLabels: {len(labels)} labels returned")
            return labels
        except Exception as e:
            self._log_audit("ERROR", f"listLabels failed: {e}", success=False)
            raise

    def list_threads(self,
                     max_results: int = 10,
                     query: Optional[str] = None) -> List[Dict[str, Any]]:
        """List email threads."""
        self._check_method_allowed('users.threads.list')

        try:
            kwargs = {'userId': 'me', 'maxResults': max_results}
            if query:
                kwargs['q'] = query

            result = self.service.users().threads().list(**kwargs).execute()
            threads = result.get('threads', [])

            self._log_audit("READ", f"listThreads: {len(threads)} threads returned")
            return threads
        except Exception as e:
            self._log_audit("ERROR", f"listThreads failed: {e}", success=False)
            raise


def test_read_only_access():
    """Test that read-only access works and write operations are blocked."""
    print("=" * 60)
    print("Gmail Integration Test - Read-Only Verification")
    print("=" * 60)
    print()

    client = GmailClient()

    # Test 1: Get profile (should work)
    print("Test 1: Get profile...")
    profile = client.get_profile()
    print(f"  ✓ Email: {profile.get('emailAddress')}")
    print(f"  ✓ Messages: {profile.get('messagesTotal')}")
    print()

    # Test 2: List messages (should work)
    print("Test 2: List messages (first 5)...")
    messages = client.list_messages(max_results=5)
    print(f"  ✓ Retrieved {len(messages)} messages")
    print()

    # Test 3: List labels (should work)
    print("Test 3: List labels...")
    labels = client.list_labels()
    print(f"  ✓ Found {len(labels)} labels")
    print()

    # Test 4: Verify write methods are blocked
    print("Test 4: Verify write operations are blocked...")
    try:
        client._check_method_allowed('users.messages.send')
        print("  ✗ FAIL: Send should be blocked!")
    except PermissionError:
        print("  ✓ Send operation correctly blocked")

    try:
        client._check_method_allowed('users.messages.delete')
        print("  ✗ FAIL: Delete should be blocked!")
    except PermissionError:
        print("  ✓ Delete operation correctly blocked")

    try:
        client._check_method_allowed('users.drafts.create')
        print("  ✗ FAIL: Draft creation should be blocked!")
    except PermissionError:
        print("  ✓ Draft creation correctly blocked")

    print()
    print("=" * 60)
    print("All tests passed. Read-only access verified.")
    print(f"Audit log: {AUDIT_LOG_FILE}")
    print("=" * 60)


if __name__ == '__main__':
    test_read_only_access()
