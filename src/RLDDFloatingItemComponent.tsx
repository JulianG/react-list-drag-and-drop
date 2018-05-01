import * as React from 'react';
import RLDDLogic, { RLDDPoint } from './RLDDLogic';
import './RLDDFloatingItem.css';

export interface RLDDFloatingItemProps {
  logic: RLDDLogic;
  draggedId: number;
}

export interface RLDDFloatingItemState {
  offsetX: number;
  offsetY: number;
}

class RLDDFloatingItemComponent extends React.PureComponent<RLDDFloatingItemProps, RLDDFloatingItemState> {

  constructor(props: RLDDFloatingItemProps) {
    super(props);
    this.state = { offsetX: 0, offsetY: 0 };
  }

  componentDidMount() {
    this.props.logic.onMouseMoveSignal.addListener(this.refresh);
  }
  componentWillUnmount() {
    this.props.logic.onMouseMoveSignal.removeListener(this.refresh);
  }

  refresh = (id: number, offset: RLDDPoint) => {
    this.setState({ offsetX: offset.x, offsetY: offset.y });
  }

  render() {
    console.log('RLDDFloatingItemComponent.render');
    if (this.props.draggedId >= -1) {
      return (
        <div
          className="dl-item floating"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: this.state.offsetX || 0,
            top: this.state.offsetY || 0
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
