// packages block
import { FC } from 'react';
import { useParams } from 'react-router';
// components block
import ServicesTable from './ServiceTable';
import PageHeader from '../../../../common/PageHeader';
// constants block / generated
import { ParamsType } from '../../../../../interfacesTypes';
import {
  ADD_SERVICE, FACILITIES_BREAD, FACILITIES_ROUTE, FACILITY_SERVICES_ROUTE, FACILITY_SERVICES_TEXT, SERVICES
} from "../../../../../constants";
import BackButton from '../../../../common/BackButton';
import { Box, Button, } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AddWhiteIcon } from '../../../../../assets/svgs';

const FacilityServicesComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const servicesBreadcrumb = { text: SERVICES, link: '' }

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box display='flex'>
          <BackButton to={FACILITIES_ROUTE} />

          <Box ml={2} />

          <PageHeader
            title={FACILITY_SERVICES_TEXT}
            path={[FACILITIES_BREAD, servicesBreadcrumb]}
          />
        </Box>

        <Link to={`${FACILITIES_ROUTE}/${id}${FACILITY_SERVICES_ROUTE}/new`}>
          <Button type="submit" variant="contained" color="primary">
            <AddWhiteIcon />
            <Box p={0.5} />
            {ADD_SERVICE}
          </Button>
        </Link>
      </Box>

      <ServicesTable />
    </>
  )
}

export default FacilityServicesComponent;
