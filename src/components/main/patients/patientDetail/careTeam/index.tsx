// packages block
// components block
import { Box, Card, Typography } from "@material-ui/core";
// constants block
import { HashIcon, MapIcon } from "../../../../../assets/svgs";
import {  PRACTICE_DETAILS, PROVIDERS_DUMMY_DATA } from "../../../../../constants";

const CareTeamComponent = (): JSX.Element => {

  return (
    <Box>
          {PROVIDERS_DUMMY_DATA.map((item) => {
            return (
              <Box mb={3}>
                <Card>
                  <Box p={4}>
                    <Box mb={2} display="flex" alignItems="center" flexWrap="wrap">
                      <Box>
                        {item.icon}
                      </Box>

                      <Box ml={2}>
                        <Typography variant="h4">{item.name}</Typography>
                        <Box py={0.2} />
                        <Typography variant="body1">{item.specialist}</Typography>
                      </Box>
                    </Box>

                    <Typography variant="h6"><strong>{PRACTICE_DETAILS}</strong></Typography>

                    <Box display="flex" alignItems="center">
                      <HashIcon />

                      <Box p={0.5} py={2} />

                      <Typography variant="body1">{item.phone}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <MapIcon />

                      <Box p={0.5} py={2} />

                      <Typography variant="body1">{item.address}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            )
          })}
    </Box>
  )
}

export default CareTeamComponent;
