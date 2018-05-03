import * as React from 'react';
import RLDD from '../RLDD';

const bananas = require('./bananas.json');

interface Item {
	id: number;
	title: string;
	body: string;
}

interface State {
	items: Item[];
}

export default class VerticalExample extends React.PureComponent<{}, State> {
	constructor(props: {}) {
		super(props);
		this.state = { items: bananas.bananas };
	}

	render() {
		// console.log('VerticalExample.render');
		const items = this.state.items;
		return (
			<div className="example vertical">
				<h2>Example 1: Draggable List of Bananas</h2>
				<p>Drag and drop items to re-order the list.</p>
				<RLDD
					cssClasses="list-container"
					items={items}
					itemRenderer={this.itemRenderer}
					onChange={this.handleRLDDChange}
				/>
			</div>
		);
	}

	private itemRenderer = (item: Item, index: number): JSX.Element => {
		return (
			<div className="item">
				<p className="title">{item.title}</p>
				<p className="body">{item.body}</p>
				<div className="small">item.id: {item.id} - index: {index}</div>
			</div>
		);
	}

	private handleRLDDChange = (reorderedItems: Array<Item>) => {
		// console.log('Example.handleRLDDChange');
		this.setState({ items: reorderedItems });
	}
}