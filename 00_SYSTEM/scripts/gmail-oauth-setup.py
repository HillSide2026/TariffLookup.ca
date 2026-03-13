#!/usr/bin/env python3
"""
Gmail OAuth Setup Script
Generates a refresh token for Gmail API read-only access.

Usage:
    python 00_SYSTEM/scripts/gmail-oauth-setup.py

Prerequisites:
    pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client python-dotenv
"""

import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

try:
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from dotenv import load_dotenv, set_key
except ImportError as e:
    print("Missing required packages. Install with:")
    print("  pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client python-dotenv")
    sys.exit(1)

# Gmail read-only scope only
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def main():
    """Run OAuth flow and save refresh token."""

    # Load environment
    env_path = project_root / '.env'
    load_dotenv(env_path)

    client_id = os.getenv('GMAIL_CLIENT_ID')
    client_secret = os.getenv('GMAIL_CLIENT_SECRET')

    if not client_id or not client_secret:
        print("ERROR: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env")
        sys.exit(1)

    print("=" * 60)
    print("Gmail OAuth Setup - Read-Only Access")
    print("=" * 60)
    print()
    print("Scope: gmail.readonly (read-only, no write access)")
    print()

    # Create OAuth client config
    client_config = {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost:8080/", "urn:ietf:wg:oauth:2.0:oob"]
        }
    }

    # Run OAuth flow
    print("Opening browser for authorization...")
    print("(If browser doesn't open, check the terminal for a URL)")
    print()

    try:
        flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
        credentials = flow.run_local_server(
            port=8080,
            prompt='consent',
            access_type='offline'
        )
    except Exception as e:
        print(f"ERROR during OAuth flow: {e}")
        print()
        print("Trying console-based flow instead...")
        flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
        credentials = flow.run_console()

    # Extract refresh token
    refresh_token = credentials.refresh_token

    if not refresh_token:
        print("WARNING: No refresh token received.")
        print("This can happen if you've already authorized this app.")
        print("Try revoking access at https://myaccount.google.com/permissions")
        print("and running this script again.")
        sys.exit(1)

    print()
    print("=" * 60)
    print("SUCCESS! OAuth authorization complete.")
    print("=" * 60)
    print()
    print(f"Refresh Token: {refresh_token[:20]}...{refresh_token[-10:]}")
    print()

    # Save to .env
    try:
        # Read current .env content
        with open(env_path, 'r') as f:
            content = f.read()

        # Update or add GMAIL_REFRESH_TOKEN
        if '# GMAIL_REFRESH_TOKEN=' in content:
            content = content.replace(
                '# GMAIL_REFRESH_TOKEN=  # Will be generated after OAuth flow',
                f'GMAIL_REFRESH_TOKEN={refresh_token}'
            )
        elif 'GMAIL_REFRESH_TOKEN=' in content:
            # Replace existing token
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('GMAIL_REFRESH_TOKEN='):
                    lines[i] = f'GMAIL_REFRESH_TOKEN={refresh_token}'
                    break
            content = '\n'.join(lines)
        else:
            # Add after GMAIL_CLIENT_SECRET
            content = content.replace(
                'GMAIL_CLIENT_SECRET=' + client_secret,
                f'GMAIL_CLIENT_SECRET={client_secret}\nGMAIL_REFRESH_TOKEN={refresh_token}'
            )

        with open(env_path, 'w') as f:
            f.write(content)

        print("Refresh token saved to .env")
        print()
    except Exception as e:
        print(f"Could not save to .env automatically: {e}")
        print()
        print("Please add this line to your .env file manually:")
        print(f"GMAIL_REFRESH_TOKEN={refresh_token}")
        print()

    # Test the credentials
    print("Testing credentials...")
    try:
        from googleapiclient.discovery import build
        service = build('gmail', 'v1', credentials=credentials)
        profile = service.users().getProfile(userId='me').execute()
        print(f"✓ Connected as: {profile.get('emailAddress')}")
        print(f"✓ Total messages: {profile.get('messagesTotal', 'N/A')}")
    except Exception as e:
        print(f"Test failed: {e}")

    print()
    print("Gmail integration setup complete!")
    print("The refresh token will be used for future API access.")

if __name__ == '__main__':
    main()
