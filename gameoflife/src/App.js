import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button } from 'antd';
import './App.css';
const { Header, Content } = Layout;

function App() {
  const rowSize = 100;
  const colomnSize = 200;
  const [alternate, setAlternate] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [cells, setCells] = useState([]);

  useEffect(()=> {
    populateTable(rowSize, colomnSize);
  },[])

  function populateTable(row, colomn)  {
    let results = [];
    Array(row).fill(0).map(() => results.push(Array(colomn).fill(0)));
    setCells(results);
  }
  
  const onCellMouseOver = (event) => {
    if(mouseDown)
    {
      const row = event.target.attributes["data-row"].value;
      const col = event.target.attributes["data-col"].value;
      markCell(row, col);
    }
  }

  const onCellClick = (event) => {
    const row = event.target.attributes["data-row"].value;
    const col = event.target.attributes["data-col"].value;
    markCell(row, col);
  }


  const markCell = (row, col) => {
    if(cells[row][col] === 0)
      cells[row][col] = 1;
    else 
      cells[row][col] = 0;
    setAlternate(!alternate);
    setCells(cells);
}

  const onGridMouseDown = () => setMouseDown(true);
  const onGridMouseUp = () => setMouseDown(false);

  const getTD = (value, row, col) => {
    const properties = {
      key : `${row}: ${col}`,
      className: value === 0? "dead": "alive",
      "data-col": col,
      "data-row": row,
      onClick: onCellClick,
      onMouseOver:onCellMouseOver
    };
    return <td {...properties}></td>
  };

  const table = cells.map((row, rowIndex) => <tr key={rowIndex}>
                                              {row.map((value, colIndex) => getTD(value, rowIndex, colIndex))}
                                            </tr>);

  const GetNextGen = grid => {
    const results = grid.map(n => n.map(val => val));
    for(let i = 0; i < grid.length; i++)
    {
      for(let j = 0; j < grid[0].length; j++)
      {
          const liveCells = GetLiveNeighborsCount(i, j, grid);
          if(grid[i][j] == 1 && liveCells <= 1)
          {
            results[i][j] = 0;
            continue;
          }
          if(grid[i][j] == 1 && liveCells >= 4)
          {
            results[i][j] = 0;
            continue;
          }
          if(grid[i][j] == 0 && liveCells === 3)
          {
            results[i][j] = 1;
            continue;
          }
          if(grid[i][j] == 1 && (liveCells === 2 || liveCells === 3))
          {
            continue;
          }
      }
    }
    return results;
  }

  const GetLiveNeighborsCount = (row, colomn, grid) => {
    const neighbors = GetNeighbors(row, colomn, grid);
    const count = neighbors.filter(n => n === 1).length;
    return count;
  }

  const GetNeighbors = (row, colomn, grid) => {
    const results = [];
    for(let i=-1; i < 2; i++)
    {
      for(let j=-1; j < 2; j++)
      {
        if(isRowAtBorder(row, i, grid) || isColomnAtBorder(colomn, j, grid))
          continue;
        if(i === 0 && j === 0)
          continue;
        results.push(grid[row + i][colomn + j])
      }
    }
    return results;
  }

  const isRowAtBorder = (row, x_position, grid) => {
    return (row === 0 && x_position === -1) || (row === grid.length - 1 && x_position === 1);
  }

  const isColomnAtBorder = (colomn, y_position, grid) => {
    return (colomn === 0 && y_position === -1) || (colomn === grid[0].length - 1 && y_position === 1);
  }

  const onStartClick = async () => {
    let holder = cells.map(n => n.map(val => val));
    let id = setInterval(()=> { 
      holder = GetNextGen(holder);
      setCells(holder);
    }, 1000);
    setIntervalId(id);
  }

  const onStopClick = () => clearInterval(intervalId);

  const onClearClick = () => {
    onStopClick();
    populateTable(rowSize, colomnSize);
  }

  const onRandomClick = () => {
    onClearClick();
    let randomGrid = getRandomGrid();
    setCells(randomGrid);
  }

  const getRandomGrid = () => {
    let randomGrid = cells.map(n => n.map(val => val));
    const numNodes = getRandomInt(rowSize * colomnSize * 0.01);
    for(let i = 0; i < numNodes; i++)
    {
      let rowIndex = getRandomInt(randomGrid.length -1);
      let colomnIndex = getRandomInt(randomGrid[0].length - 1);
      console.log(rowIndex,colomnIndex)
      randomGrid[rowIndex][colomnIndex] = 1;
    }
    return randomGrid;
  }

  const getRandomInt = max => {
    return Math.floor(Math.random() * max);
  }

  return (
    <Layout>
      <Header style={{backgroundColor: "white"}}>
        Cellular automata
      </Header>
      <Content>
        <br/>
        <Row justify='center' gutter={16}>
          <Col span={3}>
            <Button type="primary" onClick={onStartClick} block>Start</Button>
          </Col>
          <Col span={3}>
            <Button onClick={onRandomClick} block> Randomize</Button>
          </Col>
          <Col span={3}>
            <Button onClick={onStopClick} danger block> Stop </Button>
          </Col>
          <Col span={3}>
            <Button onClick={onClearClick} danger block> Clear </Button>
          </Col>
        </Row>
        <br/>
        <Row justify='center'>
          <Col span={20}>
            <table onMouseDown={onGridMouseDown} onMouseUp={onGridMouseUp} id='board'>
                <tbody>
                  {table}
                </tbody>
            </table>
          </Col>
        </Row>
      </Content>
  </Layout>
  );
}

export default App;
