//Job of this module,

/* '
should model the locked and unlocked states of the password manager

Locked: no decrypted vault available

Unlock:
- Accept master pass + stored encrypted-vault string
-deserialize encrypted vault and then decrypt
-retain decrypted vault in memory to use

Unlocked:
-get entries for site needing password inputted
-add an entry
-update an entry for password change
-remove entry if user wants to (manual)

Lock:
-encrypt the vault thats in memory
-serialize the vault and store it
-clear the vault in memory
*/
import {Vault, getEntriesForSite} from '../vaultManagement/vaultDataStructure'
import {deserializeEncryptedVault, serializeEncryptedVault} from '../vaultManagement/encryptedVaultStorage'
import {decryptVault, encryptVault} from '../crypto/crypto'
export class VaultSession {
    private vault : Vault | null = null;
    private isLocked : boolean = true;


    public async unlock(masterPass: string, storedVaultData: string) {
        const encryptedVault = deserializeEncryptedVault(storedVaultData);
        try{
            this.vault = await decryptVault(masterPass, encryptedVault);
            this.isLocked = false;
        } catch(e){
            console.error("An error has occured:", e)
        }
    }

    public async lock(masterPass: string): Promise<string> {
        
        if(this.vault === null) {
            throw new Error("Tried to lock a vault when there isn't a vault in memory.")
        }
        else {
            const encryptedVault = await encryptVault(masterPass, this.vault)
            const serializedVault = serializeEncryptedVault(encryptedVault)
            //Add later, send serialiedVault to storage module so it can store it
            return serializedVault;
            this.vault = null;
        }
    }

    public getEntriesForSite(site: string) {
        getEntriesForSite(this.vault, site)
    }
}