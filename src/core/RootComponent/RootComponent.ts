import { Action } from "redux";
import { UserEntity } from "core/Models/UserEntity";
import Authentication from "core/Authentication ";
import React from "react";
import { BasicState } from "./BasicState";
import { BasicProps } from "./BasicProps";
import { RootState } from "core/Redux/Store";
import HttpRequestHelper from "utils/HttpRequest/HttpRequestHelper";
import { IHttpRequest } from "utils/HttpRequest/IHttpRequest";


export class RootComponent<Props extends BasicProps, States extends BasicState | any> extends React.Component<Props, States>{
    httpRequestHelper: HttpRequestHelper;
    constructor(props: Readonly<Props>) {
        super(props);
        this.httpRequestHelper = new HttpRequestHelper();
    }
    async invokeAsync<T>(request: IHttpRequest): Promise<T> {

        return this.httpRequestHelper.RequestAsync<T>(request);
    }

    async invokeAsyncWithAuth(request: IHttpRequest): Promise<any> {

        const { dispatch, currentUser } = this.props;

        await Authentication.checkAuthenticationAsync(dispatch, currentUser as UserEntity);

        return this.httpRequestHelper.RequestAsync(request, currentUser?.accessToken);
    }

    invokeDispatch(action: Action) {
        const { dispatch } = this.props;
        dispatch(action);
    }

}


export function mapRootStateToProps(state: RootState) {
    return { currentUser: state.system.currentUser }
}
