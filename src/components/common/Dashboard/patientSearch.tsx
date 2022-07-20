// packages block
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { BLUE, WHITE } from "../../../theme";
import { Box, Button, Grid, Typography } from "@material-ui/core";
// components
import Search from "../Search";
// history, constant and styles block
import history from "../../../history";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import {
  FACILITY_ADMIN_SEARCH_PLACEHOLDER, PATIENTS_ROUTE, REGISTERED_PATIENTS, SEARCH_PATIENT,
  SEARCH_PLACEHOLDER,
} from "../../../constants";

const PatientSearchComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();
  const [searchQuery, setSearchQuery] = useState<string>('')

  const search = (query: string) => setSearchQuery(query)
  const handleSearch = () => history.push({ pathname: PATIENTS_ROUTE, search: searchQuery })

  return (
    <Box p={3} mb={3} bgcolor={BLUE} borderRadius={5}>
      <Box mb={2} color={WHITE}>
        <Typography variant="h3">{SEARCH_PATIENT}</Typography>
      </Box>

      <Grid container spacing={3} alignItems='center'>
        <Grid item md={8} sm={12} xs={12}>
          <Box
            px={2} py={0.5} bgcolor={WHITE} borderRadius={8} display="flex" justifyContent="space-between"
            alignItems="center"
          >
            <Box className={classes.searchContainer} width="90%" maxWidth="90%">
              <Search search={search} submit={handleSearch} placeHolder={FACILITY_ADMIN_SEARCH_PLACEHOLDER} />
            </Box>

            <Button variant="contained" color="primary" size="large" onClick={handleSearch}>{SEARCH_PLACEHOLDER}</Button>
          </Box>
        </Grid>

        <Grid item md={2} sm={12} xs={12}>
          <Link to={PATIENTS_ROUTE}>
          <Box
            className='pointer-cursor'
            border={`1px solid ${WHITE}`} borderRadius={4}
            color={WHITE} p={1.5} display='flex' width={175}
            >
            <Typography variant="body1">{REGISTERED_PATIENTS}</Typography>
          </Box>
            </Link>
        </Grid>
      </Grid>
    </Box>
  )
};

export default PatientSearchComponent;
