import * as React from 'react';
import { BasicProps } from 'core/RootComponent/BasicProps';
import { RootComponent, mapRootStateToProps } from 'core/RootComponent/RootComponent';
import { connect } from 'react-redux';

export interface ISettingsProps extends BasicProps {
}

class Settings extends RootComponent<ISettingsProps, any>  {

  public render() {
    return (
      <div>
       <h1>This is setting page</h1>
      </div>
    );
  }
}

export default connect(mapRootStateToProps)(Settings);