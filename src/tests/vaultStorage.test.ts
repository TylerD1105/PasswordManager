import {describe, expect, test} from 'vitest'
import {serializeEncryptedVault, deserializeEncryptedVault, base64ToBytes, bytesToBase64} from '../vaultManagement/vaultStorage'
import {encryptVault, decryptVault} from '../crypto/crypto'

describe('Vault Storage', () => {
    test('serializeEncryptedVault and deserializeEncryptedVault work correctly with a vault', async () => {
        const originalVault = [
            { site: 'example.com', username: 'user1', password: 'password1' },
            { site: 'another.com', username: 'user2', password: 'password2' }
        ];
        const encryptedVault = await encryptVault('testpassword', originalVault);
        const serializedVault = serializeEncryptedVault(encryptedVault);
        const deserializedVault = deserializeEncryptedVault(serializedVault);
        const decryptedVault = await decryptVault('testpassword', deserializedVault);
        expect(decryptedVault).toEqual(originalVault);

    })
    test('base64 encoding and decoding of Uint8Array works correctly', () => {
        const originalBytes = new Uint8Array([1, 2, 3, 4, 5]);
        const base64String = bytesToBase64(originalBytes);
        const decodedBytes = base64ToBytes(base64String);
        expect(decodedBytes).toEqual(originalBytes);
    })
    test('deserializeEncryptedVault throws an error for invalid JSON', () => {
        const invalidJson = "{invalidJson: true}";
        expect(() => deserializeEncryptedVault(invalidJson)).toThrow();
    })
    test('serializeEncryptedVault missing fields throws an error', () => {
        const incompleteEncryptedVault = {
            salt: new Uint8Array([1, 2, 3]),
            nonce: new Uint8Array([4, 5, 6])
            // Missing ciphertext
        } as any; // Cast to any to bypass TypeScript checks for testing purposes
        expect(() => serializeEncryptedVault(incompleteEncryptedVault)).toThrow();
    })
})