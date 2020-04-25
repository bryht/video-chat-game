import * as React from 'react';
import firebase from 'firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';

export interface IAuthPageProps {
}

export default class AuthPage extends React.Component<IAuthPageProps> {

    uiconfig: firebaseui.auth.Config;
    constructor(props: Readonly<IAuthPageProps>) {
        super(props);

        this.uiconfig = {
            signInFlow: 'redirect',
            signInSuccessUrl: '/',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ]
        };
    }

    public render() {
        return (
            <StyledFirebaseAuth uiConfig={this.uiconfig} firebaseAuth={firebase.auth()} />
        );
    }
}
