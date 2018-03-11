import * as React from 'react';
import DLContext from './draggable-list/DLContext';

import './example.css';

interface Item {
  id: number;
  title: string;
}

interface State {
  items: Item[];
}

export default class DraggableListExample extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      items: [
        { id: 0, title: 'Cavendish banana' },
        { id: 1, title: 'Lacatan banana\n2nd line\n3rd line' },
        { id: 2, title: 'Lady Finger banana\n2nd line' },
        { id: 3, title: 'Pisang jari buaya' },
        { id: 4, title: 'Señorita banana\n2nd line' },
        { id: 5, title: 'Sinwobogi banana' },
        { id: 6, title: 'Cavendish banana\n2nd line\n3rd line' },
        { id: 7, title: 'Lacatan banana' },
        { id: 8, title: 'Lady Finger banana\n2nd line' },
        { id: 9, title: 'Pisang jari buaya' },
        { id: 10, title: 'Señorita banana\n2nd line\n3rd line' },
        { id: 11, title: 'Sinwobogi banana' }
      ]
    };

    this.handleDnDContextChange = this.handleDnDContextChange.bind(this);
  }

  render() {
    return (
      <div>
        <h1>Draggable List</h1>
        <p>Drag and drop items to re-order the list.</p>
        <DLContext
          cssClasses="example"
          items={this.state.items}
          itemRenderer={(item: Item) => (
            <div className="item">
              <span>({item.id})</span><span style={{ whiteSpace: 'pre' }}>{item.title}</span>
            </div>
          )}
          onChange={this.handleDnDContextChange}
        />
      </div>
    );
  }

  private handleDnDContextChange(newItems: Array<Item>) {
    this.setState({ items: newItems });
  }
}
/////
