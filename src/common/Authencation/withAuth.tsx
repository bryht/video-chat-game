import React from "react";
import { UserEntity } from "common/Models/UserEntity";
import firebase from "firebase";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { RouteInfo } from "pages/HomePage/HomePage";
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
        constructor(props:Readonly<RouteComponentProps<RouteInfo>>) {
            super(props);

            this.state = {
                currentUser: undefined
            };
        }
        componentDidMount() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    var userEntity = new UserEntity();
                    userEntity.id = user.uid;
                    userEntity.name = user.displayName??'';
                     
                    this.setState({ currentUser: userEntity });
                } else {
                    this.setState({ currentUser: undefined });
                    this.props.history.push('/login');
                }
            });
        }

        componentDidUpdate(){
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

export const withAuth= (Component: React.ComponentType<IAuthProps>)=> withRouter(withAuthInner(Component));