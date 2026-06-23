export type GitHubTargetType = "pull" | "commit";

export interface GitHubReviewTarget {
    owner: string;
    repo: string;
    type: GitHubTargetType;
    ref: string;
    number?: number;
    fetchUrl: string;
}

function extractUrl(input: string): string {
    const trimmed = input.trim();
    const markdownLink = trimmed.match(/^\[[^\]]+\]\((https:\/\/github\.com\/[^)\s]+)\)$/i);

    return markdownLink?.[1] ?? trimmed;
}

export function parseGitHubUrl(input: string): GitHubReviewTarget {
    let parsed: URL;

    try {
        parsed = new URL(extractUrl(input));
    } catch {
        throw new Error("Invalid GitHub URL");
    }

    if (parsed.hostname.toLowerCase() !== "github.com") {
        throw new Error("URL must be a GitHub URL");
    }

    const [owner, repo, targetType, rawRef] = parsed.pathname
        .split("/")
        .filter(Boolean);

    if (!owner || !repo || !targetType || !rawRef) {
        throw new Error("Invalid GitHub URL");
    }

    if (targetType === "pull") {
        const number = parseInt(rawRef.replace(/\.(diff|patch)$/i, ""), 10);
        if (!Number.isInteger(number) || number <= 0) {
            throw new Error("Invalid GitHub pull request URL");
        }

        return {
            owner,
            repo,
            type: "pull",
            ref: String(number),
            number,
            fetchUrl: `https://github.com/${owner}/${repo}/pull/${number}.diff`,
        };
    }

    if (targetType === "commit") {
        const sha = rawRef.replace(/\.patch$/i, "");
        if (!/^[a-f0-9]{7,40}$/i.test(sha)) {
            throw new Error("Invalid GitHub commit URL");
        }

        return {
            owner,
            repo,
            type: "commit",
            ref: sha,
            fetchUrl: `https://github.com/${owner}/${repo}/commit/${sha}.patch`,
        };
    }

    throw new Error("Enter a GitHub pull request or commit URL");
}

export async function fetchDiff(input: string): Promise<string> {
    const target = parseGitHubUrl(input);
    const res = await fetch(target.fetchUrl);

    if (!res.ok) throw new Error(`Failed to fetch diff: ${res.status}`);
    return res.text();
}
