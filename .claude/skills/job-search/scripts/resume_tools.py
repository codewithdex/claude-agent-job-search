"""Deterministic helpers for resume and job-description analysis."""

from __future__ import annotations

import re
from collections import Counter
from typing import Iterable


STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "as", "is", "are", "was", "were", "be", "been", "being", "have", "has",
    "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must",
    "that", "this", "these", "those", "it", "its", "we", "you", "your", "our", "they", "their",
    "he", "she", "his", "her", "them", "who", "which", "what", "when", "where", "why", "how",
    "all", "each", "every", "both", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "can", "just", "about", "into",
    "through", "during", "before", "after", "above", "below", "up", "down", "out", "off", "over",
    "under", "again", "further", "then", "once", "here", "there", "any", "if", "while", "also",
    "etc", "eg", "ie", "per", "via", "including", "include", "required", "preferred", "experience",
    "years", "year", "work", "working", "role", "position", "team", "ability", "skills", "skill",
}


def tokenize(text: str) -> list[str]:
    tokens = re.findall(r"[a-z0-9+#./-]+", text.lower())
    return [t for t in tokens if len(t) > 2 and t not in STOPWORDS]


def extract_keywords(text: str, top_n: int = 25) -> list[tuple[str, int]]:
    counts = Counter(tokenize(text))
    return counts.most_common(top_n)


def keyword_match_score(resume: str, job_description: str) -> dict:
    resume_tokens = set(tokenize(resume))
    jd_counts = Counter(tokenize(job_description))
    if not jd_counts:
        return {
            "score": 0.0,
            "matched": [],
            "missing": [],
            "resume_keywords": [],
            "jd_keywords": [],
        }

    jd_keywords = [word for word, _ in jd_counts.most_common(30)]
    matched = [word for word in jd_keywords if word in resume_tokens]
    missing = [word for word in jd_keywords if word not in resume_tokens]
    score = round(len(matched) / max(len(jd_keywords), 1) * 100, 1)

    return {
        "score": score,
        "matched": matched,
        "missing": missing[:15],
        "resume_keywords": extract_keywords(resume, 15),
        "jd_keywords": extract_keywords(job_description, 15),
    }


def bullet_suggestions(resume: str, job_description: str, limit: int = 5) -> list[str]:
    match = keyword_match_score(resume, job_description)
    suggestions: list[str] = []
    for keyword in match["missing"][:limit]:
        suggestions.append(
            f"Consider adding a bullet that demonstrates experience with '{keyword}' using a measurable outcome."
        )
    return suggestions


def format_tracker_entry(
    company: str,
    role: str,
    status: str = "saved",
    url: str = "",
    notes: str = "",
) -> dict:
    return {
        "company": company.strip(),
        "role": role.strip(),
        "status": status.strip(),
        "url": url.strip(),
        "notes": notes.strip(),
    }


def merge_tracker_entries(existing: Iterable[dict], new_entry: dict) -> list[dict]:
    entries = list(existing)
    for idx, entry in enumerate(entries):
        if (
            entry.get("company", "").lower() == new_entry["company"].lower()
            and entry.get("role", "").lower() == new_entry["role"].lower()
        ):
            entries[idx] = {**entry, **new_entry}
            return entries
    entries.append(new_entry)
    return entries
