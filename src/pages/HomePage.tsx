import * as React from 'react';
import Settings from 'components/Setting/Settings';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Log from 'utils/Log';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { mapRootStateToProps } from 'core/RootComponent/RootComponent';

export interface RouteInfo {
    id: string;

}
interface IHomePageProps extends RouteComponentProps<RouteInfo>, BasicProps {
}

class HomePage extends React.Component<IHomePageProps> {
    public render() {
        let k = this.props.match.params.id;
        Log.Info(k);
        return (
            <Settings />
        );
    }
}

export default withRouter(connect(mapRootStateToProps)(HomePage));

