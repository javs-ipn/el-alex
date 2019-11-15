import { ParentCredential } from '../ParentCredential/parent-credential.interface';
import { UserCredential } from '../UserCredential/user-credential.interface';

export interface WebAuthenticationDetail {
    userCredential: UserCredential;
    parentCredential?: ParentCredential;
}
