import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Log from 'utils/Log';
import { BasicProps } from 'common/RootComponent/BasicProps';
import { connect } from 'react-redux';
import { mapRootStateToProps } from 'common/RootComponent/RootComponent';
import Room from 'components/Room/Room';

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
            <Room />
        );
    }
}

export default withRouter(connect(mapRootStateToProps)(HomePage));

