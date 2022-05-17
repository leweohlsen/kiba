import { Collapse, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';

import PersonTable from '../PersonTable';

const { Panel } = Collapse;
const { Option } = Select;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
  <SettingOutlined
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

export default () => {
  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
      >
        <Panel header="Zelt 1" key="1" extra={genExtra()}>
          <PersonTable />
        </Panel>
        <Panel header="Zelt 2" key="2" extra={genExtra()}>
          <PersonTable />
        </Panel>
        <Panel header="Zelt 3" key="3" extra={genExtra()}>
          <PersonTable />
        </Panel>
      </Collapse>
    </>
  );
};