import { useEffect, useState } from 'react'
import './App.css'
import Api from './services/api'
import Cell from './components/Cell/Cell'
import Loader from './components/Loader/Loader'

const App = () => {
  const [modes, setModes] = useState([])
  const [loading, setLoading] = useState(false)
  const [field, setField] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [hoveredCells, setHoveredCells] = useState([])
  const [showedHoveredCell, setShowedHoveredCell] = useState({})

  const getSortedHoveredCells = () => {
    return hoveredCells.sort((hoveredCellA, hoveredCellB) => hoveredCellA.row - hoveredCellB.row || hoveredCellA.column - hoveredCellB.column)
  }

  const changeStatusGame = () => {
    setHoveredCells([])
    setIsStarted(!isStarted)
  }

  useEffect(() => {
    setLoading(true)
    Api.getModes()
      .then(modes => {
        setModes(modes)
        setLoading(false)
      })
  }, [])


  return (
    <div className="app">
      { loading 
        ?
        <Loader />
        :
        <div className='game'>
          <div className="game-wrapper">
            <div className='game-settings'>
              <select className='game-mode-select' disabled={ isStarted } defaultValue={ field } onChange={ (event) => setField(Number(event.target.value)) }>
                <option value={ 0 } disabled hidden>Pick mode</option>
                {
                  modes.map(mode => (
                    <option key={ mode.id } value={ mode.field }>{ mode.name }</option>
                  ))
                }
              </select>
              <button className='game-switch-btn' disabled={ !field } onClick={ () => changeStatusGame() }>{ isStarted ? 'Stop' : 'Start' }</button>
            </div>
            { 
              isStarted &&
              <div className='game-filed'>
                {
                  Array.from(Array(field).keys()).map((rowNumber) => (
                    <div className="field-row" key={ rowNumber }>
                      {
                        Array.from(Array(field).keys()).map((cellNumber) => (
                          <Cell key={ cellNumber } row={ rowNumber + 1 } column={ cellNumber + 1 } setHoveredCells={ setHoveredCells } hoveredCells={ hoveredCells } showedHoveredCell={ showedHoveredCell } />
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
                getSortedHoveredCells().map(cell => (
                  <li key={ `${cell.row}${cell.column}` } className='hovered-cells-item' onMouseEnter={ () => setShowedHoveredCell(cell) } onMouseLeave={ () => setShowedHoveredCell({}) }>
                    <span>row: { cell.row } column: { cell.column }</span>
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