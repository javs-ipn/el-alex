
import { HashService } from '../../../src/api/services/Hash/hash-methods.service';

describe('HashService', () => {
    test('basicUsernamePassword a base64 encoded string for username:password', (done) => {
        const hashService = new HashService();
        const hashedString = 'bGVvOnBhc3N3b3Jk';
        const hashedStringService = hashService.basicUsernamePassword('leo', 'password');
        expect(hashedStringService).toBe(hashedString);
        done();
    });

});
