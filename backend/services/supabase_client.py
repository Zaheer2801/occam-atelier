"""
Server-side Supabase client. Uses service role key for full DB access.
Import as: from services.supabase_client import supa
"""
from __future__ import annotations

import os
from supabase import create_client, Client

_client: Client | None = None


def supa() -> Client:
    global _client
    if _client is None:
        url = os.environ["SUPABASE_URL"]
        # Prefer service role key for backend; fall back to anon for development
        key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ["SUPABASE_ANON_KEY"]
        _client = create_client(url, key)
    return _client
