import { useState } from 'react'
import './Cell.css'

const Cell = ({ row, column, setHoveredCells, hoveredCells, showedHoveredCell }) => {
  const [active, setActive] = useState(false)
  const isShowHoveredCell = showedHoveredCell.row === row && showedHoveredCell.column === column

  const onHoverCell = () => {
    setActive(!active)
    const isHoveredCell = hoveredCells.find((hoveredCell) => hoveredCell.row === row && hoveredCell.column === column )

    if (isHoveredCell) {
      const filteredCells = hoveredCells.filter(hoveredCell => hoveredCell.row !== isHoveredCell.row || hoveredCell.column !== isHoveredCell.column)
      setHoveredCells(filteredCells)
    } else {
      setHoveredCells([ ...hoveredCells, { row, column } ])
    }
  }

  return (
    <div className={ `cell ${ active && 'active-cell' } ${ isShowHoveredCell && 'active-cell-show' }` } onMouseEnter={ () => onHoverCell() }></div>
  )
}

export default Cell