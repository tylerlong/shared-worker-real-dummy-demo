import React from 'react';
import { Button, Space, Tag, Typography } from 'antd';
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
          <Space>
            <Button onClick={() => store.removeCallSession(cs.id)} danger>
              Delete
            </Button>
            Change status to
            <Button onClick={() => store.updateCallSessionStatus(cs.id, 'init')}>init</Button>
            <Button onClick={() => store.updateCallSessionStatus(cs.id, 'ringing')}>ringing</Button>
            <Button onClick={() => store.updateCallSessionStatus(cs.id, 'answered')}>answered</Button>
            <Button onClick={() => store.updateCallSessionStatus(cs.id, 'disposed')}>disposed</Button>
          </Space>
        </div>
      ))}
      <Button onClick={() => store.newCallSession()}>Add a new call session</Button>
    </>
  );
});

export default App;
