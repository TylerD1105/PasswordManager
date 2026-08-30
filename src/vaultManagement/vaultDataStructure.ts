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

export function deserializeVault(serializedVault: string): Vault{
    try {
        const parsedVault = JSON.parse(serializedVault) as Vault;
        return parsedVault;
    }
    catch (error) {
        console.error("Failed to deserialize vault:", error);
        throw new Error("Failed to deserialize vault: Invalid JSON format");
    }
}