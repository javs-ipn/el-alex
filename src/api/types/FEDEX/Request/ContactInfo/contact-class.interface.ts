export class ContactInfo {

    public personName: string;
    public corporateName: string;
    public phoneNumber: string;
    public emailAddress: string;

    constructor(contactInfoOptions: ContactInfo) {
        if (contactInfoOptions.personName) {
            this.personName = contactInfoOptions.personName;
        } else {
            this.personName = '';
        }
        if (contactInfoOptions.corporateName) {
            this.corporateName = contactInfoOptions.corporateName;
        } else {
            this.corporateName = '';
        }
        if (contactInfoOptions.phoneNumber) {
            this.phoneNumber = contactInfoOptions.phoneNumber;
        } else {
            this.phoneNumber = '';
        }
        if (contactInfoOptions.emailAddress) {
            this.emailAddress = contactInfoOptions.emailAddress;
        } else {
            this.emailAddress = '';
        }
    }
}
