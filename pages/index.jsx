import { useEffect, useState } from "react";
import Head from 'next/head'

export default function Game() {
  const sizeRange = [3, 10]
  const [size, setSize] = useState(3)
  const [versusBot, setVersusBot] = useState(1)
  const [startGame, setStartGame] = useState(false)
  const [tiles, setTiles] = useState(null)
  const [count, setCount] = useState(1)
  const [config, setConfig] = useState(true)

  function handleChangeSize(par) {
    let newSize;
    if (par) {
      newSize = size + 1
      if (newSize <= sizeRange[1])
        setSize(newSize)
    } else {
      newSize = size - 1
      if (newSize >= sizeRange[0])
        setSize(size - 1)
    }
  }

  function handleChangeOpponent(par) {
    if (par) {
      setVersusBot(1)
    } else {
      setVersusBot(0)
    }
  }

  function handleStartGame() {
    setStartGame(true)
    setConfig(false)
    let tiles = []
    for (let i = 0; i < size; i++) {
      let row = []
      for (let j = i * (size); j < (i * size) + size; j++) {
        row.push("")
      }
      tiles.push(row)
    }
    setTiles(tiles)
  }

  useEffect(() => {
    if (tiles) {
      if (checkDiagonal() || checkHorizontal() || checkVertical()) {
        let winner = count % 2 == 0 ? 'Player 1' : 'Player 2';
        if (count % 2 == 1 && versusBot) {
          winner = "Bot"
        }
        setStartGame(false)
        setCount(1)
        setTimeout(function () {
          alert(`${winner} wins!`)
        }, 100)
      } else if (count >= size * size + 1) {
        setTimeout(function () {
          setStartGame(false)
          setCount(1)
          alert(`Game draw!`)
        }, 100)
      } else {
        if (count % 2 == 0 && versusBot) {
          runBotTurn()
        }
      }
    }
  }, [tiles])

  function handleClickTile(i, j) {
    if (tiles[i][j] == "" && startGame) {
      let newTiles = [...tiles]
      if (count % 2 == 1) {
        newTiles[i][j] = "X"
        setTiles(newTiles)
        setCount(count + 1)
      } else {
        if (!versusBot) {
          newTiles[i][j] = "O"
          setTiles(newTiles)
          setCount(count + 1)
        }
      }
    }
  }

  function checkHorizontal() {
    let result = true;
    for (let i = 0; i < size; i++) {
      result = isThisRowSame(tiles[i]);
      if (result) {
        break;
      }
    }
    return result
  }

  function isThisRowSame(arr) {
    let result = true;
    let firstValue = arr[0]
    if (firstValue == "") return false
    for (let i = 1; i < size; i++) {
      if (arr[i] != firstValue) result = false
    }
    return result
  }

  function checkVertical() {
    let result = true;
    for (let i = 0; i < size; i++) {
      result = isThisColSame(i)
      if (result) {
        break;
      }
    }
    return result
  }

  function isThisColSame(idx) {
    let result = true;
    let firstValue = tiles[0][idx]
    if (firstValue == "") return false
    for (let i = 1; i < size; i++) {
      if (tiles[i][idx] != firstValue) result = false
    }
    return result
  }

  function checkDiagonal() {
    let result = true;
    let j = 0;
    let firstValue = tiles[0][0]
    if (firstValue == "") return false
    for (let i = 1; i < size; i++) {
      j++;
      if (firstValue != tiles[i][j]) result = false
    }
    return result
  }

  function runBotTurn() {
    // check available slot
    if (count >= size * size + 1) {
      return false;
    }

    let flag = false;
    let i, j;
    while (!flag) {
      i = randomize(0, size - 1);
      j = randomize(0, size - 1);
      if (tiles[i][j] == "") {
        flag = true;
      }
    }

    if (flag) {
      setTimeout(function () {
        if (startGame) {
          let newTiles = [...tiles]
          newTiles[i][j] = "O"
          setTiles(newTiles)
          setCount(count + 1)
        }
      }, 500)
    }
  }

  function randomize(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (<>
    <Head>
      <title>Play Custom Tictactoe</title>
    </Head>
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className={`config text-center`}>
        {
          config && <>
            <h1 className="mb-4">Play custom tic tac toe</h1>
            <h2 className="mb-1">Size</h2>
            <div className="mb-3">
              <button className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2" onClick={() => handleChangeSize(0)}>-</button>
              <input type="text" value={size} className="text-gray-900 text-sm rounded-lg p-2.5 text-center w-25 input-size me-2" readOnly />
              <button className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5" onClick={() => handleChangeSize(1)}>+</button>
            </div>
            <h2 className="mb-1">Opponent</h2>
            <div className="mb-3">
              <button className={`text-white ${versusBot ? 'bg-gray-900' : 'bg-gray-500'} hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 me-2`} onClick={() => handleChangeOpponent(1)}>Versus BOT</button>
              <button className={`text-white ${!versusBot ? 'bg-gray-900' : 'bg-gray-500'} hover:bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5`} onClick={() => handleChangeOpponent(0)}>Versus Player</button>
            </div>
            <div className="">
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5" onClick={() => handleStartGame()}>Start</button>
            </div>
          </>
        }
        {!config &&
          <>
            <h1 className="mb-4">Your game is on!</h1>

            <div className="board mb-4">
              {tiles && tiles.map((elmt, idx) => {
                return (
                  <div className="row flex" key={idx}>
                    {
                      elmt.map((e, i) => {
                        return (
                          <div key={`tile-${i}`} className={`tile ${e == "" && 'open'}`} onClick={() => handleClickTile(idx, i)}>{e}</div>
                        )
                      })
                    }
                  </div>
                )
              })}

            </div>
            <div>
              <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 rounded-lg text-sm px-5 py-2.5 me-1" onClick={() => setConfig(true)}>Home</button>
              <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5" onClick={() => handleStartGame(true)}>Restart</button>
            </div>
          </>
        }
      </div>

    </div>
  </>
  );
}
