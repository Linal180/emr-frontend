// component block
import RolesTable from './RolesTable';
import PageHeader from '../../../common/PageHeader';
// constants, history, styling block
import {
  ADD_NEW_TEXT, ADD_ROLES_ROUTE, ROLES_BREAD, ROLES_TABS, ROLES_TEXT,
} from '../../../../constants';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Tab } from '@material-ui/core';
import { ChangeEvent, useState } from 'react';

const RolesComponent = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>('1')

  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      <PageHeader
        title={ROLES_TEXT}
        path={[ROLES_BREAD]}
        hasComponent
        buttonText={ADD_NEW_TEXT}
        linkToPage={ADD_ROLES_ROUTE}
      />

      <TabContext value={selectedTab}>
        <TabList onChange={handleChange} aria-label="Profile top tabs">
          {ROLES_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>
        <TabPanel value="1">
          <RolesTable />
        </TabPanel>
        <TabPanel value="2">
          <RolesTable 
            customRole
          />
        </TabPanel>
      </TabContext>
    </>
  )
};

export default RolesComponent;
