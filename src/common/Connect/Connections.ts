import { IAuthProps } from "common/Authentication/IAuthProps";
import { withRouter } from "react-router-dom";
import { AuthenticationConnection } from "common/Authentication/AuthenticationConnection";

export function withAuth<TRouterParas>(Component: React.ComponentType<IAuthProps<TRouterParas>>){
    return withRouter(AuthenticationConnection<TRouterParas>(Component));
} 
    