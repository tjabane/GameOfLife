import React, { useState, useEffect } from 'react';
import { Layout, Row,Col } from 'antd';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const rowSize = 50;
  const colomnSize = 100;
  const [alternate, setAlternate] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [cells, setCells] = useState([]);

  useEffect(()=> {
    populateTable(rowSize, colomnSize);
    function populateTable(row, colomn)  {
      let results = [];
      Array(row).fill(0).map(() => results.push(Array(colomn).fill(0)));
      setCells(results);
    }
  },[])

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
  return (
    <Layout>
      <Header style={{backgroundColor: "white"}}>
        cellular automata
      </Header>
      <Content>
        <Row justify='center'>
          <Col span={12}>
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
