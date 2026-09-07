import {describe, expect, test} from 'vitest'
import {VaultSession} from '../vaultManagement/vaultSession'
import *  as vaultStorage from '../vaultManagement/encryptedVaultStorage' ;
import * as vaultStructure from '../vaultManagement/vaultDataStructure'
import * as crypto from '../crypto/crypto'
describe('Vault Session Tests', async () => {
    const vaultSession = new VaultSession;
        const originalVault = [
            { site: 'example.com', username: 'user1', password: 'password1' },
            { site: 'another.com', username: 'user2', password: 'password2' }
        ];
         const encryptedVault = await crypto.encryptVault('testpassword', originalVault);
        const serializedVault = vaultStorage.serializeEncryptedVault(encryptedVault);
    test('getEntriesForSite should throw an error when the vault is locked',  async () => {
        expect(() => vaultSession.getEntriesForSite('example.com')).toThrow;
    })
    test('Valid unlock works', async () => {
        await vaultSession.unlock('testpassword', serializedVault)
        expect(vaultSession.getEntriesForSite('example.com')).toEqual([originalVault[0]])
    })



})