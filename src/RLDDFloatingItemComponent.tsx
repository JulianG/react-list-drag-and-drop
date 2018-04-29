import * as React from 'react';
import RLDDLogic from './RLDDLogic';

import './RLDDFloatingItem.css';

export interface RLDDFloatingItemProps {
  logic: RLDDLogic;
}

class RLDDFloatingItemComponent extends React.PureComponent<RLDDFloatingItemProps, {}> {

  constructor(props: RLDDFloatingItemProps) {
    super(props);
  }

  componentDidMount() {
    this.props.logic.onMouseMoveSignal.addListener(this.refresh);
  }
  componentWillUnmount() {
    this.props.logic.onMouseMoveSignal.removeListener(this.refresh);
  }

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

  private refresh = () => {
    this.forceUpdate();
  }

}

export default RLDDFloatingItemComponent;
