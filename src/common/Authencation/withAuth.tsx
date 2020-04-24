import React from "react";
import { UserEntity } from "common/Models/UserEntity";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RouteInfo } from "pages/HomePage/HomePage";
import FirebaseHelper from "utils/FirebaseHelper";
export interface IProps {
}

export interface IAuthProps {
    currentUser?: UserEntity;

}
export interface IStates {
    currentUser?: UserEntity;
}
export const withAuthInner = (Component: React.ComponentType<IAuthProps>) => {

    class WithAuthentication extends React.Component<RouteComponentProps<RouteInfo>, IStates> {
        constructor(props: Readonly<RouteComponentProps<RouteInfo>>) {
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
        public render() {
            return (
                <Component currentUser={this.state.currentUser}></Component>
            );
        }
    }

    return WithAuthentication;

}

export const withAuth = (Component: React.ComponentType<IAuthProps>) => withRouter(withAuthInner(Component));