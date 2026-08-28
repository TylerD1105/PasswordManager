import { getDomain } from 'tldts';
export function getRegistrableDomain(input: string): string | null {
const domain = normalizeSite(input);
if (domain === null) {
    return null;
}
return getDomain(domain);
}

export function matchesSite(candidateURL: string, storedURL: string) : boolean {
    const candidateDomain = getRegistrableDomain(candidateURL);
    const storedDomain = getRegistrableDomain(storedURL);
    if (candidateDomain === null || storedDomain === null) {
        return false;
    }
    return candidateDomain === storedDomain;
}

export function normalizeSite(input: string): string | null{
    try{
        const url = new URL(input);
        
        return url.hostname.toLowerCase() || null;
    }catch{
        return null;
    }
}