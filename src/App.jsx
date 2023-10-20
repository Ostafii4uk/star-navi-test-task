import { useEffect, useState } from 'react';
import './App.css'

const Cell = ({ row, column, setHoveredCell, hoveredCells }) => {
  const [active, setActive] = useState(false)

  const onHoverCell = (row, column) => {
    setActive(!active)
    const isUnHoveredCell = hoveredCells.find((hoveredCell) => hoveredCell.row === row && hoveredCell.column === column )

    if (isUnHoveredCell) {
      const filteredCell = hoveredCells.filter(hoveredCell => !(hoveredCell.row === isUnHoveredCell.row && hoveredCell.column === isUnHoveredCell.column)).sort()
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
      <h1>StarNavi: Test task</h1>
        { loading
          ?
          <p>Loading...</p>
          :
        <div className='game'>
          <div className='game-settings'>
            <p>Fields:{ fields }</p>
            <select className='game-mode-select' disabled={ isStarted } defaultValue={ fields } onChange={ (event) => setFields(event.target.value) }>
              <option value={ 0 } disabled hidden>Pick mode</option>
              { modes.map(mode => (
                <option key={ mode.id } value={ mode.field }>{ mode.name }</option>
              ))}
            </select>
            <button className='game-start-btn' disabled={ !fields } onClick={ () => setIsStarted(!isStarted) }>{ isStarted ? 'Stop' : 'Start'}</button>
          </div>
          <div className='game-fileds'>
            { isStarted
              &&
              [...Array(Number(fields)).keys()].map((fieldCell, indexRow) => (
                <div className="field-row">
                  {
                    [...Array(Number(fields)).keys()].map((fieldCell, indexColumn) => (
                      <Cell row={ indexRow + 1 } column={ indexColumn + 1 } setHoveredCell={ setHoveredCell } hoveredCells={ hoveredCell } />
                    ))
                  }
                </div>
              ))
            }
          </div>
          <div className='game-hovered-cell'>
            <ul>
              {
                hoveredCell.map(cell => (
                  <li>
                    <span>Column: { cell.column }</span>
                    <span>Row: { cell.row }</span>
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
