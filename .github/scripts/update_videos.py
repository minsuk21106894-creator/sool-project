#!/usr/bin/env python3
"""Refresh data/videos.json with the latest videos from the Team Jumak YouTube channel.

Reads the channel's RSS feed (no API key required), parses the most recent uploads,
and rewrites the JSON only when the video list actually changed. Designed to be run
weekly by .github/workflows/update-videos.yml.
"""
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

CHANNEL_ID = "UCAcW8lIs0fXtlc0cHH0INIg"  # Team Jumak (@soolysoolsool)
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"
TOP_N = 6
OUT_PATH = Path(__file__).resolve().parents[2] / "data" / "videos.json"

NS = {
    "a": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
}


TRAILING_HASHTAGS_RE = re.compile(r"\s*(?:#\S+\s*)+$")


def clean_title(raw):
    """Strip trailing #hashtag clutter so titles render cleanly in card UI."""
    return TRAILING_HASHTAGS_RE.sub("", raw).strip()


def fetch_videos():
    req = urllib.request.Request(RSS_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        xml_data = resp.read()
    root = ET.fromstring(xml_data)
    out = []
    for entry in root.findall("a:entry", NS)[:TOP_N]:
        out.append({
            "id": entry.find("yt:videoId", NS).text,
            "title": clean_title(entry.find("a:title", NS).text),
            "publishedAt": entry.find("a:published", NS).text[:10],
        })
    return out


def main():
    if not OUT_PATH.exists():
        print(f"ERROR: {OUT_PATH} does not exist.", file=sys.stderr)
        return 1
    current = json.loads(OUT_PATH.read_text(encoding="utf-8"))
    new_videos = fetch_videos()
    if current.get("videos") == new_videos:
        print("No video changes — skipping update.")
        return 0
    current["videos"] = new_videos
    OUT_PATH.write_text(
        json.dumps(current, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {OUT_PATH.name} with {len(new_videos)} videos.")
    print(f"Latest: {new_videos[0]['title']} ({new_videos[0]['publishedAt']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
