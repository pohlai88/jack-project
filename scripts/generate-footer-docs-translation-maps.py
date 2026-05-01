"""
Generate `scripts/footer-docs-i18n-maps/<locale>.byEnglish.json` maps from unique
English strings under `landing.footerDocs`.

Uses deep-translator (Google Translate web backend).

Prereq: `pip install deep-translator`

Usage: `python scripts/generate-footer-docs-translation-maps.py`
"""
from __future__ import annotations

import json
import re
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
UNIQUE_PATH = ROOT / ".artifacts/i18n/footer-docs-unique-english-lines.txt"
OUT_DIR = ROOT / "scripts/footer-docs-i18n-maps"

LOCALES: dict[str, str] = {
    "es": "es",
    "id": "id",
    "zh-CN": "zh-CN",
    "vi": "vi",
    "ms": "ms",
    "th": "th",
}


def skip_line(text: str) -> bool:
    if re.match(r"^https?://", text):
        return True
    if re.match(r"^[^\s@]+@[^\s]+\.[^\s]+$", text):
        return True
    return False


def translate_chunk(translator: GoogleTranslator, text: str, attempts: int = 5) -> str:
    delay = 0.55
    last_exc: Exception | None = None
    for _ in range(attempts):
        try:
            return translator.translate(text)
        except Exception as exc:  # pragma: no cover - network path
            last_exc = exc
            time.sleep(delay)
            delay = min(delay * 1.65, 9.0)
    raise RuntimeError(f"translate failed after {attempts} attempts: {last_exc}") from last_exc


def main() -> None:
    raw_lines = [ln.strip() for ln in UNIQUE_PATH.read_text(encoding="utf8").splitlines() if ln.strip()]
    to_translate = [s for s in raw_lines if not skip_line(s)]

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for locale_file, target in LOCALES.items():
        translator = GoogleTranslator(source="en", target=target)
        mapping: dict[str, str] = {}

        for index, text in enumerate(to_translate):
            mapping[text] = translate_chunk(translator, text)
            time.sleep(0.18)
            if index % 12 == 0 or index == len(to_translate) - 1:
                print(f"{locale_file}: {index + 1}/{len(to_translate)}")

        out_path = OUT_DIR / f"{locale_file}.byEnglish.json"
        out_path.write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
        print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
