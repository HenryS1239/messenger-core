import axios from 'axios';
import * as jwt from 'jsonwebtoken';

export interface IKeyCloakUserInfo {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    locale: string;
    family_name: string;
    email: string;
}

export class KeyCloak {

    constructor(private readonly config: { base_url: string, realm: string, client_id?: string, client_secret?: string }, private readonly token: string) {
    }

    parsedToken() {
        return jwt.decode(this.token) as any;
    }

    async userinfo(): Promise<IKeyCloakUserInfo> {
        const url = `${this.config.base_url}/auth/realms/${this.config.realm}/protocol/openid-connect/userinfo`;
        const response = await axios.create({
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        }).post(url);
        return response.data as IKeyCloakUserInfo;
    }
}
