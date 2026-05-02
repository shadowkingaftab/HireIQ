from github import Github
from github.GithubException import UnknownObjectException
from typing import Dict, List
import os
import json
import redis
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Redis configuration for caching
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASSWORD,
        decode_responses=True
    )
except Exception as e:
    print(f"Warning: Could not connect to Redis: {e}")
    redis_client = None

def fetch_github_data(username: str) -> Dict:
    """Fetch GitHub data for a user: repos, languages, commits."""
    # 1. Check cache first
    if redis_client:
        try:
            cached_data = redis_client.get(f"github:{username}")
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            print(f"Error reading from Redis: {e}")

    # 2. Fetch from GitHub API
    try:
        g = Github(GITHUB_TOKEN) if GITHUB_TOKEN else Github()
        user = g.get_user(username)

        # Fetch repos
        repos = user.get_repos()
        repo_data = []
        languages = {}
        total_commits = 0

        for repo in repos:
            # Skip forks (optional)
            if repo.fork:
                continue
            # Get languages
            repo_languages = repo.get_languages()
            for lang, bytes_used in repo_languages.items():
                languages[lang] = languages.get(lang, 0) + bytes_used
            
            # Get commit count (approximate - can be slow for many repos)
            try:
                # Limit to recent commits or first page to avoid timeouts
                commits = repo.get_commits().get_page(0)
                total_commits += len(commits)
            except Exception:
                pass
                
            repo_data.append({
                "name": repo.name,
                "url": repo.html_url,
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "language": repo.language
            })

        # Sort languages by bytes (most used first)
        sorted_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)
        languages_dict = {lang: bytes_used for lang, bytes_used in sorted_languages}

        result = {
            "username": username,
            "repo_count": len(repo_data),
            "total_commits": total_commits,
            "languages": languages_dict,
            "repos": repo_data
        }

        # 3. Cache result for 24 hours
        if redis_client:
            try:
                redis_client.setex(
                    f"github:{username}",
                    timedelta(hours=24),
                    json.dumps(result)
                )
            except Exception as e:
                print(f"Error writing to Redis: {e}")

        return result
    except UnknownObjectException:
        raise ValueError(f"GitHub user '{username}' not found.")
    except Exception as e:
        # Fallback: Return cached data if available, even if we were just trying to refresh it
        if redis_client:
            try:
                cached_data = redis_client.get(f"github:{username}")
                if cached_data:
                    print(f"Warning: API failed, returning stale cache for {username}")
                    return json.loads(cached_data)
            except:
                pass
        raise ValueError(f"Error fetching GitHub data: {str(e)}")
