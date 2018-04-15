import * as React from 'react';
import RLDDLogic from './RLDDLogic';

import './RLDDFloatingItem.css';

export interface RLDDFloatingItemProps {
  logic: RLDDLogic;
}

class RLDDFloatingItemComponent extends React.Component<RLDDFloatingItemProps, {}> {
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

export default RLDDFloatingItemComponent;
