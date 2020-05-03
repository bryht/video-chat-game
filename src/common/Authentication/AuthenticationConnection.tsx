import React from "react";
import { User } from "common/Models/User";
import { RouteComponentProps } from "react-router-dom";
import FirebaseHelper from "utils/FirebaseHelper";
import { IAuthProps } from "./IAuthProps";
import Loading from "components/Loading/Loading";
import Log from "utils/Log";
interface IAuthStates {
    currentUser?: User;
}
interface AuthenticationConnectionConfig {
    redirectPath?: string;
}
export function AuthenticationConnection<TRouterParas>(ChildComponent: React.ComponentType<IAuthProps<TRouterParas>>, config: AuthenticationConnectionConfig = {}) {

    interface IWithAuthProps extends RouteComponentProps<TRouterParas> { }

    class WithAuthentication extends React.Component<IWithAuthProps, IAuthStates> {
        constructor(props: Readonly<IWithAuthProps>) {
            super(props);

            this.state = {
                currentUser: undefined
            };
        }
        componentDidMount() {
            FirebaseHelper.onAuthStateChanged(user => {
                this.setState({ currentUser: user });
                if (!user) {
                    this.redirectLogin();
                }
            })
        }

        componentWillUnmount() {
            FirebaseHelper.unregisterAuth();
        }

        componentDidUpdate() {
            if (!this.state.currentUser) {
                this.redirectLogin();
            }
        }

        logout = () => {
            FirebaseHelper.signOut();
        }

        private redirectLogin = () => {
            var redirectPath = '/login';
            if (config.redirectPath) {
                redirectPath = `/login/${config.redirectPath.split('/').join('_')}`;
            } else if (this.props.match.url) {
                redirectPath = `/login/${this.props.match.url.split('/').join('_')}`;
            }
            this.props.history.push(redirectPath);
        }

        public render() {
            const { currentUser } = this.state;
            if (!currentUser) {
                return <Loading />;
            }
            return (
                <ChildComponent
                    currentUser={currentUser}
                    logout={this.logout}
                    history={this.props.history}
                    location={this.props.location}
                    match={this.props.match}></ChildComponent>
            );
        }
    }
    return WithAuthentication;
}

