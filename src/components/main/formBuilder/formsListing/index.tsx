//packages block
import { Add as AddIcon, } from '@material-ui/icons'
import { ChangeEvent, useState } from 'react';
import { Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
//components block
import PageHeader from "../../../common/PageHeader";
import FormTable from "./FormTable";
import Templates from '../templates'
// constants block
import { ADD_NEW_TEXT, FORM_BUILDER_ROUTE, FORMS, FORM_BUILDER_FIELDS_TABS } from "../../../../constants";
const FormListing = () => {
  //states
  const [selectedTab, setSelectedTab] = useState<string>('1')
  //handle change
  const handleChange = (_: ChangeEvent<{}>, newValue: string) => setSelectedTab(newValue)
  //render
  return (
    <>
      <PageHeader
        title={FORMS}
        hasComponent
        buttonText={ADD_NEW_TEXT}
        noAdd={selectedTab === '1' ? false : true}
        linkToPage={`${FORM_BUILDER_ROUTE}/add`}
        startIcon={<AddIcon />}
      />
      <TabContext value={selectedTab}>
        <TabList onChange={handleChange} aria-label="Profile top tabs">
          {FORM_BUILDER_FIELDS_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>
        <TabPanel value="1">
          <FormTable />
        </TabPanel>
        <TabPanel value="2">
          <Templates />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default FormListing