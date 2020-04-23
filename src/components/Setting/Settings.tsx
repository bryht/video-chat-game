import * as React from 'react';
import { BasicProps } from 'common/RootComponent/BasicProps';
import { RootComponent, mapRootStateToProps } from 'common/RootComponent/RootComponent';
import { connect } from 'react-redux';
import styles from './Settings.module.scss';
export interface ISettingsProps extends BasicProps {
}

class Settings extends RootComponent<ISettingsProps, any>  {

  public render() {
    return (
      <div className={styles.main}>
        <h1>This is setting page</h1>
      </div>
    );
  }
}

export default connect(mapRootStateToProps)(Settings);