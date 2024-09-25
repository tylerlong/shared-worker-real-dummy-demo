import React from 'react';
import { Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';

const { Title } = Typography;

const App = auto((props: { store: Store }) => {
  const { store } = props;
  return <Title>I am {store.role}</Title>;
});

export default App;
