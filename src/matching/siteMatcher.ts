import { getDomain } from 'tldts';
export function getRegistrableDomain(input: string): string | null {

try {
const url = new URL(input);
return getDomain(url.hostname);
} catch {
    return null;
}
}

export function matchesSite(candidateURL: string, storedURL: string) : boolean {
    const candidateDomain = getRegistrableDomain(candidateURL);
    const storedDomain = getRegistrableDomain(storedURL);
    if (candidateDomain === null || storedDomain === null) {
        return false;
    }
    return candidateDomain === storedDomain;
}