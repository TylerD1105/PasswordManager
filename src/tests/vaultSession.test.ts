import {describe, expect, test, beforeAll} from 'vitest'
import {VaultSession} from '../vaultManagement/vaultSession'
import *  as vaultStorage from '../vaultManagement/encryptedVaultStorage'
import * as crypto from '../crypto/crypto'
describe('Vault Session Tests', () => {
    let serializedVault: string;
    const originalVault = [
        { site: 'example.com', username: 'user1', password: 'password1' },
        { site: 'another.com', username: 'user2', password: 'password2' },
        { site: 'example.com', username: 'user2', password: 'password123'}
    ];
    beforeAll(async () => {

        const encryptedVault = await crypto.encryptVault('testpassword', originalVault);
        serializedVault = vaultStorage.serializeEncryptedVault(encryptedVault);
    })

    test('getEntriesForSite should throw an error when the vault is locked',  async () => {
        const vaultSession = new VaultSession;
        expect(() => vaultSession.getEntriesForSite('example.com')).toThrow();
    })
    test('Valid unlock works', async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault)
        expect(vaultSession.getEntriesForSite('example.com')).toEqual([originalVault[0], originalVault[2]])
    })
    test('Wrong master password throws an error', async () => {
        const vaultSession = new VaultSession;
        await expect(vaultSession.unlock('wrongpassword', serializedVault)).rejects.toThrow();
    })
    test('Should throw an error if I try to lock a vault that is already locked' , async () => {
        const vaultSession = new VaultSession;
        await expect(vaultSession.lock('testpassword')).rejects.toThrow();
    })
    test('lock clears vault',  async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault)
        await vaultSession.lock('testpassword')
        expect(() => vaultSession.getEntriesForSite('example.com')).toThrow();
    })
    test('add entry to vault', async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault)
        vaultSession.addEntrytoSite('example.com', 'username3', 'passypass')
        expect(vaultSession.getEntriesForSite('example.com').length).toBe(3)
    })
    test('Remove entry from vault', async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault)
        vaultSession.removeEntry('example.com', 'user2')
        expect(vaultSession.getEntriesForSite('example.com').length).toBe(1)
    }) 
    test('Locked vault add and remove should throw', async () => {
        const vaultSession = new VaultSession;
        expect(() => vaultSession.addEntrytoSite('example.com', 'user4', 'password')).toThrow()
        expect(() => vaultSession.removeEntry('example.com', 'user1')).toThrow()

    })

    test('Add Entry Test', async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault);
        vaultSession.addEntrytoSite('example.com', 'user3', 'password');
        expect(vaultSession.getEntriesForSite('example.com')).toContainEqual({
    site: 'example.com',
    username: 'user3',
    password: 'password'
});
    })
    test('Remove Entry Test', async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault);
        vaultSession.removeEntry('example.com', 'user2');
        expect(vaultSession.getEntriesForSite('example.com')).not.toContainEqual({
            site:'example.com',
            username: 'user2',
            password: 'password123'
        })
    })
    test('see if vault additions survive serialization', async () => {
        const vaultSession = new VaultSession;
        await vaultSession.unlock('testpassword', serializedVault)
        vaultSession.addEntrytoSite('example.com', 'user3', 'password');
        serializedVault = await vaultSession.lock('testpassword')
        const vaultSessionB = new VaultSession;
        await vaultSessionB.unlock('testpassword', serializedVault)
        expect(vaultSessionB.getEntriesForSite('example.com')).toContainEqual({
            site: 'example.com',
            username: 'user3',
            password: 'password'
        })
    }) 

})