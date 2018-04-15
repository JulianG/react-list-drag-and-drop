import * as React from 'react';
import RLDD from './RLDD';

import './example.css';

interface Item {
  id: number;
  title: string;
  img: string;
}

export interface ExampleState {
  items: Item[];
}

export default class Example extends React.Component<{}, ExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      items: [
        { id: 0, title: 'Cavendish banana', img: 'https://www.placehold.it/300x50/333333/ffffff' },
        { id: 1, title: 'Lacatan banana', img: 'https://www.placehold.it/300x50/333333/ffffff' },
        { id: 2, title: 'Lady Finger banana', img: 'https://www.placehold.it/300x100/333333/ffffff' },
        { id: 3, title: 'Pisang jari buaya', img: 'https://www.placehold.it/300x150/333333/ffffff' },
        { id: 4, title: 'Señorita banana', img: 'https://www.placehold.it/300x200/333333/ffffff' },
        { id: 5, title: 'Sinwobogi banana', img: 'https://www.placehold.it/300x250/333333/ffffff' },
        { id: 6, title: 'Cavendish banana', img: 'https://www.placehold.it/300x300/333333/ffffff' }
      ]
    };

    this.itemRenderer = this.itemRenderer.bind(this);
    this.handleDnDContextChange = this.handleDnDContextChange.bind(this);
  }

  render() {
    const items = this.state.items;
    return (
      <div>
        <h1>Draggable List of Bananas</h1>
        <p>Drag and drop items to re-order the list.</p>
        <RLDD
          cssClasses="example"
          items={items}
          itemRenderer={this.itemRenderer}
          onChange={this.handleDnDContextChange}
        />
      </div>
    );
  }

  private itemRenderer(index: number): JSX.Element {
    const item = this.state.items[index];
    return (
      <div className="item">
        <div>
          <span style={{ whiteSpace: 'pre' }}>{item.title}</span>
        </div>
        <img src={item.img + '?text=' + encodeURI(item.title)} />
        <div className="small">(id: {item.id})</div>
      </div>
    );
  }

  private handleDnDContextChange(reorderedItems: Array<Item>) {
    this.setState({ items: reorderedItems });
  }
}
