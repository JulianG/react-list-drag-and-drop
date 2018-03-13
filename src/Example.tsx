import * as React from 'react';
import DLContext from './draggable-list/DLContext';

import './example.css';

interface Item {
  id: number;
  title: string;
  img: string;
}

interface State {
  items: Item[];
}

export default class Example extends React.Component<{}, State> {
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

    this.handleDnDContextChange = this.handleDnDContextChange.bind(this);
  }

  render() {
    const items = this.state.items;
    return (
      <div>
        <h1>Draggable List</h1>
        <p>Drag and drop items to re-order the list.</p>
        <DLContext
          cssClasses="example"
          layout={'vertical'}
          threshold={15}
          items={items}
          itemRenderer={(i: number) => {
            const item = items[i];
            return (
              <div className="item">
                <div><span style={{ whiteSpace: 'pre' }}>{item.title}</span></div>
                <img src={item.img + '?text=' + encodeURI(item.title)} />
                <div className="small">(id: {item.id})</div>
              </div>
            );
          }}
          onChange={this.handleDnDContextChange}
        />
        <p>
          Placeholder images by{' '}
          <a target="_blank" href="https://placeholder.com/">
            placeholder.com
          </a>
        </p>
      </div>
    );
  }

  private handleDnDContextChange(newItems: Array<Item>) {
    this.setState({ items: newItems });
  }
}
/////
