//packages block
import { ChangeEvent, useState } from 'react'
import { Box, colors, Tab, Typography } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
//constants block
import { FORM_BUILDER_ADD_FIELDS_TABS, FORM_FIELDS } from '../../../../../constants';
import { useFormBuilderSidebarStyles } from '../../../../../styles/formbuilder/sidebarStyle';
import { FormFields } from './FormFields'
import { PreDefinedComponents } from './preDefinedComponents'
import { FormSidebarProps } from '../../../../../interfacesTypes';

const Sidebar = ({ dispatch, formState }: FormSidebarProps) => {
  const [selectedTab, setSelectedTab] = useState<string>('1')
  const classes = useFormBuilderSidebarStyles()

  const handleChange = (_: ChangeEvent<{}>, newValue: string) => setSelectedTab(newValue)

  return (
    <Box className={classes.main}>
      <Box pb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant='h4'>{FORM_FIELDS}</Typography>
      </Box>

      <TabContext value={selectedTab}>
        <TabList onChange={handleChange}>
          {FORM_BUILDER_ADD_FIELDS_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>

        <TabPanel value="1">
          <PreDefinedComponents formState={formState} dispatch={dispatch} />
        </TabPanel>

        <TabPanel value="2">
          <FormFields />
        </TabPanel>
      </TabContext>

    </Box>
  )
}

export default Sidebar;