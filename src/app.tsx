import React from 'react';
import { Button, Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';

const { Title } = Typography;

const App = auto((props: { store: Store }) => {
  const { store } = props;
  return (
    <>
      <Title>I am {store.role}</Title>
      {store.callSessions.map((cs) => (
        <div key={cs.id}>I am a call session, my status is {cs.status}</div>
      ))}
      <Button onClick={() => store.newCallSession()}>Add a new call session</Button>
    </>
  );
});

export default App;
