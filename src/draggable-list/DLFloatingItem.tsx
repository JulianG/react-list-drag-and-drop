import * as React from 'react';
import DLLogic from './DLLogic';

import './DLFloatingItem.css';

interface Props {
  logic: DLLogic;
}

class DLFloatingItem extends React.Component<Props, {}> {
  render() {
    const logic = this.props.logic;
    const offset = logic.getOffset();
    if (this.props.logic.getDraggedId() >= -1) {
      return (
        <div
          className="dl-item floating"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: offset.x || 0,
            top: offset.y || 0
          }}
        >
          {this.props.children}
        </div>
      );
    } else {
      return undefined;
    }
  }
}

export default DLFloatingItem;
