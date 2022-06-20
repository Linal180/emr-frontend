// component block
import RolesTable from './RolesTable';
import PageHeader from '../../../common/PageHeader';
// constants, history, styling block
import {
  ADD_NEW_TEXT, ADD_ROLES_ROUTE, DASHBOARD_BREAD, ROLES_BREAD, ROLES_TABS, ROLES_TEXT, SETTINGS_ROUTE,
} from '../../../../constants';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Box, Button, Tab } from '@material-ui/core';
import { ChangeEvent, useState } from 'react';
import BackButton from '../../../common/BackButton';
import { AddWhiteIcon } from '../../../../assets/svgs';
import { Link } from 'react-router-dom';

const RolesComponent = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<string>('1')

  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      <Box display="flex" justifyContent='space-between' alignItems='center'>
        <Box display="flex" alignItems="center">
          <BackButton to={`${SETTINGS_ROUTE}`} />

          <Box ml={2}>
            <PageHeader
              title={ROLES_TEXT}
              path={[DASHBOARD_BREAD, ROLES_BREAD]}
            />
          </Box>
        </Box>

        <Button variant="contained" color="primary" component={Link} to={ADD_ROLES_ROUTE}>
          <AddWhiteIcon />
          <Box ml={1} />
          {ADD_NEW_TEXT}
        </Button>
      </Box>

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
