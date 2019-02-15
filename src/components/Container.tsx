import * as React from 'react'
import Card from './Card'
import update from 'immutability-helper'
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const style = {
	height: 600,
	width: 400,
}

export interface IContainerState {
	cards: Array<{
		id: number
		text: string
	}>
}

export default class Container extends React.Component<{}, IContainerState> {
	public state = {
		cards: [
			{
				id: 1,
				text: 'Write a cool JS library',
			},
			{
				id: 2,
				text: 'Make it generic enough',
			},
			{
				id: 3,
				text: 'Write README',
			},
			{
				id: 4,
				text: 'Create some examples',
			},
			{
				id: 5,
				text:
					'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
			},
			{
				id: 6,
				text: '???',
			},
			{
				id: 7,
				text: 'PROFIT',
			},
		],
	}

	public render() {
		const { cards } = this.state;

		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<div style={style}>
					{cards.map((card, i) => (
						<Card
							key={card.id}
							index={i}
							id={card.id}
							text={card.text}
							moveCard={this.moveCard}
						/>
					))}
				</div>
			</DragDropContextProvider>
		);
	}

	private moveCard = (dragIndex: number, hoverIndex: number) => {
		const { cards } = this.state;
		const dragCard = cards[dragIndex];

		this.setState(
			update(this.state, {
				cards: {
					$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
				},
			}),
		);
	}
}