import React from 'react';
import { Button, Tag, Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';

const { Title } = Typography;

const App = auto((props: { store: Store }) => {
  const { store } = props;
  return (
    <>
      <Title>I am {store.role}</Title>
      {store.callSessions.map((cs) => (
        <div key={cs.id}>
          A call session with status: <Tag color="blue">{cs.status}</Tag>{' '}
          <Button onClick={() => store.removeCallSession(cs.id)}>Delete</Button>
        </div>
      ))}
      <Button onClick={() => store.newCallSession()}>Add a new call session</Button>
    </>
  );
});

export default App;
