"""
Playwright async browser pool.
- 5 concurrent contexts (semaphore)
- Circuit breaker: 3 consecutive failures → open 10 min
- Health check endpoint
- Context recycled after every use (close + new)
"""
from __future__ import annotations

import asyncio
import time
import structlog
from contextlib import asynccontextmanager
from typing import AsyncGenerator

log = structlog.get_logger()

POOL_SIZE          = 5
FAILURE_THRESHOLD  = 3
COOLDOWN_SECONDS   = 600  # 10 min


class BrowserPool:
    def __init__(self, size: int = POOL_SIZE) -> None:
        self._size        = size
        self._semaphore   = asyncio.Semaphore(size)
        self._pw          = None
        self._browser     = None
        self._failures    = 0
        self._circuit_open  = False
        self._cooldown_until = 0.0

    async def start(self) -> None:
        from playwright.async_api import async_playwright  # type: ignore
        self._pw = await async_playwright().start()
        self._browser = await self._pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
        )
        log.info("browser_pool_started", size=self._size)

    async def stop(self) -> None:
        if self._browser:
            await self._browser.close()
        if self._pw:
            await self._pw.stop()
        log.info("browser_pool_stopped")

    def _circuit_available(self) -> bool:
        if not self._circuit_open:
            return True
        if time.monotonic() >= self._cooldown_until:
            self._circuit_open = False
            log.info("browser_circuit_half_open")
            return True
        return False

    @asynccontextmanager
    async def acquire(self) -> AsyncGenerator:
        if not self._circuit_available():
            raise RuntimeError("BrowserPool: circuit breaker open — too many crashes")

        await self._semaphore.acquire()
        context = None
        try:
            context = await self._browser.new_context(
                viewport={"width": 1280, "height": 900},
                user_agent=(
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                accept_downloads=True,
            )
            self._failures = 0
            yield context
        except Exception as exc:
            self._failures += 1
            if self._failures >= FAILURE_THRESHOLD:
                self._circuit_open = True
                self._cooldown_until = time.monotonic() + COOLDOWN_SECONDS
                log.error("browser_circuit_open", failures=self._failures)
                from services.slack_alerts import alert  # type: ignore
                await alert(f"🔴 Browser pool circuit breaker OPEN after {self._failures} failures: {exc}")
            raise
        finally:
            if context:
                try:
                    await context.close()
                except Exception:
                    pass
            self._semaphore.release()

    async def health_check(self) -> bool:
        try:
            async with self.acquire() as ctx:
                page = await ctx.new_page()
                await page.goto("about:blank", timeout=5000)
                await page.close()
            return True
        except Exception:
            return False


# ── Singleton ──────────────────────────────────────────────────────────────────
_pool: BrowserPool | None = None


def get_pool() -> BrowserPool:
    global _pool
    if _pool is None:
        _pool = BrowserPool()
    return _pool
