export class HashService {

    /**
     * @description Hashes username:password into base64 string
     * @param {string} username
     * @param {string} password
     * @returns {string} hashed string
     */
    public basicUsernamePassword(username: string, password: string): string {
        const buffer = Buffer.from(`${username}:${password}`, 'utf8');
        const base64String = buffer.toString('base64');
        return base64String;
    }
}
