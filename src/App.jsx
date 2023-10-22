import { useEffect, useState } from 'react';
import './App.css'
import { v4 as uuidv4 } from 'uuid';

const Cell = ({ row, column, setHoveredCell, hoveredCells }) => {
  const [active, setActive] = useState(false)

  const onHoverCell = (row, column) => {
    setActive(!active)
    const isUnHoveredCell = hoveredCells.find((hoveredCell) => hoveredCell.row === row && hoveredCell.column === column )

    if (isUnHoveredCell) {
      const filteredCell = hoveredCells.filter(hoveredCell => !(hoveredCell.row === isUnHoveredCell.row && hoveredCell.column === isUnHoveredCell.column))
      setHoveredCell(filteredCell)
    } else {
      setHoveredCell([ ...hoveredCells, { row, column } ])
    }
  }

  return (
    <div className={`fields-cell ${ active && 'active-cell' }`} onMouseEnter={ () => onHoverCell(row, column) }></div>
  )
}

const App = () => {
  const [modes, setModes] = useState([])
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [hoveredCell, setHoveredCell] = useState([])


  const getModes = async () => {
    const res = await fetch('https://60816d9073292b0017cdd833.mockapi.io/modes');
    if (!res.ok) {
      throw new Error(`${res.status} = ${res.statusText}`);
    }
    return await res.json();
  }

  const changeStatusGame = () => {
    setHoveredCell([])
    setIsStarted(!isStarted)
  }

  useEffect(() => {
    setLoading(true)
    getModes()
      .then(modes => {
        setModes(modes)
        setLoading(false)
      })
  }, [])


  return (
    <div className="app">
      { loading 
        ?
        <span class="loader"></span>
        :
        <div className='game'>
          <div className="game-wrapper">
            <div className='game-settings'>
              <select className='game-mode-select' disabled={ isStarted } defaultValue={ fields } onChange={ (event) => setFields(event.target.value) }>
                <option value={ 0 } disabled hidden>Pick mode</option>
                { modes.map(mode => (
                  <option key={ mode.id } value={ mode.field }>{ mode.name }</option>
                ))}
              </select>
              <button className='game-start-btn' disabled={ !fields } onClick={ () => changeStatusGame() }>{ isStarted ? 'Stop' : 'Start'}</button>
            </div>
            { isStarted &&
              <div className='game-fileds'>
                {
                  [...Array(Number(fields)).keys()].map((fieldCell, indexRow) => (
                    <div className="field-row" key={ indexRow }>
                      {
                        [...Array(Number(fields)).keys()].map((fieldCell, indexColumn) => (
                          <Cell key={ indexColumn } row={ indexRow + 1 } column={ indexColumn + 1 } setHoveredCell={ setHoveredCell } hoveredCells={ hoveredCell } />
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            }
          </div>
          <div className='game-hovered-cells'>
            <h4 className='hovered-cells-title'>Hover squares</h4>
            <ul className='hovered-cells-list'>
              {
                hoveredCell.sort((hoveredCellA, hoveredCellB) => hoveredCellA.row - hoveredCellB.row || hoveredCellA.column - hoveredCellB.column).map(cell => (
                  <li key={ uuidv4() } className='hovered-cells-item'>
                    <span>row { cell.row } column { cell.column }</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default App;