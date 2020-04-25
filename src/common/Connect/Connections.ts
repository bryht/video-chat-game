import { IAuthProps } from "common/Authentication/IAuthProps";
import { withRouter } from "react-router-dom";
import { AuthenticationConnection } from "common/Authentication/AuthenticationConnection";

export const withAuth = (Component: React.ComponentType<IAuthProps>) => withRouter(AuthenticationConnection(Component));