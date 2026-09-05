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
import * as vaultFunctions from '../vaultManagement/vaultDataStructure'
import {deserializeEncryptedVault, serializeEncryptedVault} from '../vaultManagement/encryptedVaultStorage'
import {decryptVault, encryptVault} from '../crypto/crypto'
export class VaultSession {
    private vault : vaultFunctions.Vault | null = null;
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
            this.vault = null;
            return serializedVault;
            
        }
    }
    //work on this later
    public getEntriesForSite(site: string) : vaultFunctions.VaultEntry[] {
        if (this.vault === null) {
            throw new Error("Tried to grab entries from a vault that is not in memory")
        }
        return vaultFunctions.getEntriesForSite(this.vault, site)
    }

    public addEntrytoSite(site: string, username: string, password: string) {
        if (this.vault === null){
            throw new Error ("Tried to add entries from a vault that is not in memory")
        }
        vaultFunctions.addEntry(this.vault, site, username, password);
    }

    public removeEntry(site: string, username: string) {
        if(this.vault === null) {
            throw new Error("Tried to remove entries from a vault that is not in memory")
        }
        vaultFunctions.removeEntry(this.vault, site, username);
    }
}