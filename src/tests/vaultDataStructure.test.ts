import {describe, expect, test} from 'vitest'
import {addEntry, getEntriesForSite, removeEntry, serializeVault, deserializeVault, VaultEntry, Vault} from '../vaultManagement/vaultDataStructure'

describe('Vault Data Structure', () => {
    test('addEntry adds a new entry to the vault', () => {
        const vault: Vault = []
        const newVault = addEntry(vault, 'example.com', 'user1', 'password1');
        expect(newVault).toHaveLength(1);
        expect(newVault[0]).toEqual({ site: 'example.com', username: 'user1', password: 'password1' });
    })
    test('getEntriesForSite retrieves entries for a specific site', () => {
        const vault: Vault = [
            { site: 'example.com', username: 'user1', password: 'password1' },
            { site: 'example.com', username: 'user2', password: 'password2' },
            { site: 'another.com', username: 'user3', password: 'password3' }
        ];
        const entries = getEntriesForSite(vault, 'example.com');
        expect(entries).toHaveLength(2);
        expect(entries).toEqual([
            { site: 'example.com', username: 'user1', password: 'password1' },
            { site: 'example.com', username: 'user2', password: 'password2' }
        ]);
        const entry = getEntriesForSite(vault, 'another.com');
        expect(entry).toHaveLength(1);
        expect(entry).toEqual([{ site: 'another.com', username: 'user3', password: 'password3' }]);
    })
    test('removeEntry removes an entry from the vault', () => {
        const vault: Vault = [
            { site: 'example.com', username: 'user1', password: 'password1' },  
        ];
        const newVault = removeEntry(vault, 'example.com', 'user1');
        expect(newVault).toHaveLength(0);
    });
    test('serializeVault and deserializeVault work correctly', () => {
        const vault: Vault = [
            { site: 'example.com', username: 'user1', password: 'password1' },
            { site: 'another.com', username: 'user2', password: 'password2' }
        ];
        const serializedVault = serializeVault(vault);
        const deserializedVault = deserializeVault(serializedVault);
        expect(deserializedVault).toEqual(vault);
    })
});