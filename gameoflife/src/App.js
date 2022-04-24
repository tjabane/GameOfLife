import React, { useState } from 'react';
import { Layout } from 'antd';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const [rows, setRows] = useState(80);
  const [colomns, setColomns] = useState(200);
  const table = [...Array(rows).keys()].map(() => <tr>
                                                {Array(colomns).fill(0).map(() => <td></td>)}
                                              </tr>);
  console.log(table);
  return (
    <Layout>
      <Header style={{backgroundColor: "white"}}>
        cellular automata
      </Header>
      <Content>
        <table id='board'>
          <tbody>
            {table}
          </tbody>
        </table>
      </Content>
  </Layout>
  );
}

export default App;
