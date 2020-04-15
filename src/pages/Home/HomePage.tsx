import * as React from 'react';
import Settings from 'components/Setting/Settings';

export interface IHomePageProps {
}

export default class HomePage extends React.Component<IHomePageProps> {
    public render() {
        return (
            <Settings/>
        );
    }
}
