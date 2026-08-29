import {describe, expect, test} from 'vitest'
import {deriveEncryptionKey, generateRandomSalt, encryptVault, decryptVault} from '../crypto/crypto'

describe('Round Trip Decryption Encryption', () => {
    test('should encrypt and then decrypt the vault data correctly, plaintext string', async () => {
        const vaultData = "This is a vault data string test";
        const password = "masterPassword";
        const encryptedVault = await encryptVault(password, vaultData);
        const decryptedData = await decryptVault(password, encryptedVault);
        expect(decryptedData).toBe(vaultData);
        
    })
    test('Encrypt and Decrypt with JSON data', async () => {
        const vaultData = JSON.stringify({
            username: "user@example.com",
            password: "securePassword123",
            site: "https://example.com"
        })
        const password = "masterPassword";
        const encryptedVault = await encryptVault(password, vaultData);
        const decryptedData = await decryptVault(password, encryptedVault);
        expect(decryptedData).toBe(vaultData);
    })
    test('Encrypt and Decrypt with empty string', async () => {
        const vaultData = "";
        const password = "masterPassword";
        const encryptedVault = await encryptVault(password, vaultData);
        const decryptedData = await decryptVault(password, encryptedVault);
        expect(decryptedData).toBe(vaultData);
    })
})
describe('Wrong password decryption', () => {
    test('should throw an error when decrypting with the wrong password', async () => {
        const vaultData = "This is a vault data string test";
        const correctPassword = "correctPassword";
        const wrongPassword = "wrongPassword";
        const encryptedVault = await encryptVault(correctPassword, vaultData);
        await expect(decryptVault(wrongPassword, encryptedVault)).rejects.toThrow();
    })
})

describe('Modified ciphertext decryption', () => {
    test('should throw an error when decrypting with modified ciphertext', async () => {
        const vaultData = "This is a vault data string test";
        const password = "masterPassword";
        const encryptedVault = await encryptVault(password, vaultData);
        // Modify the ciphertext to simulate tampering
        const modifiedCiphertextVault = {
            salt: encryptedVault.salt,
            nonce: encryptedVault.nonce,
            ciphertext: new Uint8Array(encryptedVault.ciphertext)
        }
        modifiedCiphertextVault.ciphertext[0] = 0xff;
        await expect(decryptVault(password, modifiedCiphertextVault)).rejects.toThrow();
    })
})

describe("Salt and Nonce Generation", () => {
    test("When vault encryption is performed, a random salt and nonce should be generated", async () => {
        const vaultData = "This is a vault data string test";
        const password = "masterPassword";
        const encryptedVault = await encryptVault(password, vaultData);
        expect(encryptedVault.salt).toBeInstanceOf(Uint8Array);
        expect(encryptedVault.nonce).toBeInstanceOf(Uint8Array);
        expect(encryptedVault.ciphertext).toBeInstanceOf(Uint8Array);
        expect(encryptedVault.salt.length).toBe(16);
    })
    test("When same salt and nonce are used, the encryption should be deterministic", async () => {
        const vaultData = "This is a vault data string test";
        const password = "masterPassword";
        const encryptedVault1 = await encryptVault(password, vaultData);
        const encryptedVault2 = await encryptVault(password, vaultData);
        expect(encryptedVault1.salt).not.toEqual(encryptedVault2.salt);
        expect(encryptedVault1.nonce).not.toEqual(encryptedVault2.nonce);
    })

})