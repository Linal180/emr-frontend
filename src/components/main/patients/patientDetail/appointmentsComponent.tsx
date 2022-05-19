// packages block
import { Box } from "@material-ui/core";
// import { Pagination } from "@material-ui/lab";
import { FC } from "react";
// components block
import CardComponent from "../../../common/CardComponent";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// constants, styles and svgs block
// import { Appointmentstatus } from "../../../../generated/graphql";
import { AppointmentsComponentProps } from "../../../../interfacesTypes";

const AppointmentsComponent: FC<AppointmentsComponentProps> = ({title}): JSX.Element => {

    return (
            <CardComponent cardTitle={title}>
                {/* <AppointmentList appointments={upComing} type={Appointmentstatus.Initiated} reload={() => fetchComing()} /> */}

                {/* {((!upComingLoading && upComing?.length === 0) || upComingError) && ( */}
                <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                </Box>
                {/* )} */}

                {/* {totalPagesComing > 1 &&
                    <Box my={2} display="flex" justifyContent="flex-end">
                        <Pagination
                            count={totalPagesComing}
                            shape="rounded"
                            variant="outlined"
                            page={pageCompleted}
                            onChange={handleComingChange}
                        />
                    </Box>
                } */}
            </CardComponent>
    )
};

export default AppointmentsComponent;
