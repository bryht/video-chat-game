import { Middleware } from "redux";
import { RootState } from "../Store";
import Consts from "core/Consts";
import Authentication from "core/Authentication ";
import HttpRequestHelper from "utils/HttpRequest/HttpRequestHelper";
import { UserEntity } from "core/Models/UserEntity";

export const HttpMiddleware: Middleware = api => next => async action => {
  if (action.type === Consts.api) {
    const { system } = api.getState() as RootState;
    let httpRequestHelper = new HttpRequestHelper();
    api.dispatch(action.onStart);

    await Authentication.checkAuthenticationAsync(api.dispatch, system.currentUser as UserEntity);

    action.value = await httpRequestHelper.RequestAsync<any>({ url: action.url, method: action.method, body: action.body }, system.currentUser?.accessToken);

    api.dispatch(action.onSuccess);

  } else {

    return next(action);
  }

}