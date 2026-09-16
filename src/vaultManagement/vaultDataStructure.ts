export interface VaultEntry {
    site: string;
    username: string;
    password: string;
}
export type Vault = VaultEntry[];

export function addEntry(vault: Vault, site: string, username: string, password: string): Vault {
    const newEntry: VaultEntry = { site, username, password };
    return [...vault, newEntry];
}

export function getEntriesForSite(vault: Vault, site: string): VaultEntry[] {
    return vault.filter((entry) => entry.site === site);
}

export function removeEntry(vault: Vault, site: string, username: string): Vault {
    return vault.filter((entry) => entry.site !== site || entry.username !== username);
}

export function serializeVault(vault: Vault): string {
    return JSON.stringify(vault);
}
//fix this LATER
export function deserializeVault(serializedVault: string): Vault{
    try {
        const parsedVault = JSON.parse(serializedVault) as Vault;
        try {
            Array.isArray(parsedVault);

        }
        catch(error : unknown) {
            console.error('parsedVault is not of an Array type')
        }
        
            for(let i = 0; i < parsedVault.length; i++) {
                if (parsedVault[i] === null) {
                    console.error('Entry detected as null')
                }
                if (!('site' in parsedVault[i] && 'username' in parsedVault[i] && 'password' in parsedVault[i])) {
                    console.error('Does not have all fields required for an entry')
                }
                if (typeof parsedVault.site === 'string' || typeof parsedVault.username)
            }
        
        return parsedVault;
    }
    catch (error) {
        console.error("Failed to deserialize vault:", error);
        throw new Error("Failed to deserialize vault: Invalid JSON format");
    }
}