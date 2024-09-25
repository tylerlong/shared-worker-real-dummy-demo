import React from 'react';
import { Button, Space, Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';

const { Text, Title } = Typography;

const App = auto((props: { store: Store }) => {
  const { store } = props;
  return (
    <>
      <Title>Untitled App</Title>
      <Space>
        <Button
          onClick={() => {
            store.count -= 1;
          }}
        >
          -
        </Button>
        <Text>{store.count}</Text>
        <Button
          onClick={() => {
            store.count += 1;
          }}
        >
          +
        </Button>
      </Space>
    </>
  );
});

export default App;
