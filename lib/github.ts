export interface PRInfo {
    owner: string;
    repo: string;
    number: number;
}

export function parsePRUrl(url: string): PRInfo {
    const match = url.match(
        /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
    );
    if (!match) throw new Error("Invalid GitHub PR URL");

    return { owner: match[1], repo: match[2], number: parseInt(match[3]) }; 
}

export async function fetchDiff(url: string): Promise<string> {
    const { owner, repo, number } = parsePRUrl(url);
    const res = await fetch(
        `https://github.com/${owner}/${repo}/pull/${number}.diff`
    );
    if (!res.ok) throw new Error(`Failed to fetch diff: ${res.status}`);
    return res.text();
}