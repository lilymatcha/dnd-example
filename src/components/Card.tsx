import * as React from 'react';
import {
    ConnectDragSource,
    ConnectDropTarget,
    DragSource,
    DragSourceConnector,
	DragSourceMonitor,
	DropTarget,
	DropTargetMonitor,
	DropTargetConnector,
} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import { XYCoord } from 'dnd-core';
import ItemTypes from './ItemTypes';
import '../styles/Card.css';


const cardSource = {
	beginDrag(props: ICardProps) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const cardTarget = {
	hover(props: ICardProps, monitor: DropTargetMonitor, component: Card | null) {
		if (!component) {
			return null
		}
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = (findDOMNode(
			component,
		) as Element).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveCard(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
        monitor.getItem().index = hoverIndex
        return;
	},
}

export interface ICardProps {
	id: any
	text: string
	index: number
	moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface ICardSourceCollectedProps {
	isDragging: boolean
	connectDragSource: ConnectDragSource
}

interface ICardTargetCollectedProps {
	connectDropTarget: ConnectDropTarget
}

class Card extends React.Component<ICardProps & ICardSourceCollectedProps & ICardTargetCollectedProps> {
	public render() {
		const {
			text,
			connectDragSource,
			connectDropTarget,
		} = this.props;

		return connectDragSource(
			connectDropTarget(<div className="card">{text}</div>),
		)
	}
}

export default DropTarget<ICardProps, ICardTargetCollectedProps>(
	ItemTypes.CARD,
	cardTarget,
	(connect: DropTargetConnector) => ({
		connectDropTarget: connect.dropTarget(),
	}),
)(
	DragSource<ICardProps, ICardSourceCollectedProps>(
		ItemTypes.CARD,
		cardSource,
		(connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		}),
	)(Card),
)