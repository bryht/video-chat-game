import React from "react";
import { User } from "common/Models/User";
import { RouteComponentProps } from "react-router-dom";
import FirebaseHelper from "utils/FirebaseHelper";
import { IAuthProps } from "./IAuthProps";
import Loading from "components/Loading/Loading";
interface IAuthStates {
    currentUser?: User;
}
export function AuthenticationConnection<TRouterParas>(ChildComponent: React.ComponentType<IAuthProps<TRouterParas>>) {

    class WithAuthentication extends React.Component<RouteComponentProps<TRouterParas>, IAuthStates> {
        constructor(props: Readonly<RouteComponentProps<TRouterParas>>) {
            super(props);

            this.state = {
                currentUser: undefined
            };
        }
        componentDidMount() {
            FirebaseHelper.onAuthStateChanged(user => {
                this.setState({ currentUser: user });
                if (!user) {
                    this.props.history.push('/login');
                }
            })
        }

        componentDidUpdate() {
            if (!this.state.currentUser) {
                this.props.history.push('/login');
            }
        }

        logout = () => {
            FirebaseHelper.signOut();
        }

        public render() {
            const { currentUser } = this.state;
            if (!currentUser) {
                return <Loading/>;
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

