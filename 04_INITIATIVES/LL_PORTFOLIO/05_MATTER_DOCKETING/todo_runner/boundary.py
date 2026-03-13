"""Drive boundary guard — Stage 2.9.

Ensures a Google Doc lives inside the approved Second Brain folder
before any read/write is allowed.
"""

from __future__ import annotations

import os


def assert_doc_in_approved_folder(drive, doc_id: str) -> None:
    folder_id = os.environ.get("SECOND_BRAIN_FOLDER_ID")
    if not folder_id:
        raise RuntimeError("SECOND_BRAIN_FOLDER_ID not set in env.")

    meta = drive.files().get(
        fileId=doc_id, fields="id,name,parents"
    ).execute()
    parents = meta.get("parents", []) or []

    if folder_id not in parents:
        raise PermissionError(
            f"Boundary violation: doc {doc_id} not in approved folder "
            f"{folder_id}. parents={parents}"
        )
