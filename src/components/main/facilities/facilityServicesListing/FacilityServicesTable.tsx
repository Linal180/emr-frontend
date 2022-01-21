// packages block
import { FC, useState, useEffect, ChangeEvent, useContext } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import Alert from "../../../common/Alert";
import ConfirmationModal from "../../../common/ConfirmationModal";
import TableLoader from "../../../common/TableLoader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { ListContext } from "../../../../context/listContext";
import { useFindAllServicesLazyQuery, useRemoveServiceMutation, ServicePayload } from "../../../../generated/graphql";
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../assets/svgs";
import { ACTION, NAME, DURATION, STATUS, PRICE, PAGE_LIMIT, CANT_DELETE_SERVICE, SERVICE, DELETE_SERVICE_DESCRIPTION, ACTIVE, INACTIVE } from "../../../../constants";
import { FacilityServicesProps } from "../../../../interfacesTypes";

const FacilityServicesTable: FC<FacilityServicesProps> = ({ setTableData, tableData }): JSX.Element => {
  const classes = useTableStyles()
  const { fetchAllServiceList } = useContext(ListContext)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [deleteServiceId, setDeleteServiceId] = useState<string>("");

  const [findAllServices, { loading, error }] = useFindAllServicesLazyQuery({
    variables: {
      serviceInput: {
        paginationOptions: {
          page,
          limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setTableData && setTableData([])
    },

    onCompleted(data) {
      const { findAllServices } = data || {};

      if (findAllServices) {
        const { services, pagination } = findAllServices
        services && setTableData && setTableData(services)

        if (!searchQuery && pagination) {
          const { totalPages } = pagination
          totalPages && setTotalPage(totalPages)
        }
      }
    }
  });

  const [removeService, { loading: deleteServiceLoading }] = useRemoveServiceMutation({
    onError() {
      Alert.error(CANT_DELETE_SERVICE)
      setOpenDelete(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeService: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpenDelete(false)
          findAllServices();
          fetchAllServiceList();
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllServices()
    }
  }, [page, findAllServices, searchQuery]);

  const onDeleteClick = (id: string) => {
    if (id) {
      setDeleteServiceId(id)
      setOpenDelete(true)
    }
  };

  const handleDeleteService = async () => {
    if (deleteServiceId) {
      await removeService({
        variables: {
          removeService: {
            id: deleteServiceId
          }
        }
      })
    }
  };

  const handleChange = (event: ChangeEvent<unknown>, value: number) => setPage(value);

  const handleSearch = () => { }
  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className={classes.searchContainer}>
          <TextField
            value={searchQuery}
            className={classes.tablesSearchIcon}
            onChange={({ target: { value } }) => setSearchQuery(value)}
            onKeyPress={({ key }) => key === "Enter" && handleSearch()}
            name="searchQuery"
            variant="outlined"
            placeholder="Search"
            fullWidth
            InputProps={{
              startAdornment:
                <IconButton color="default">
                  <TablesSearchIcon />
                </IconButton>
            }}
          />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(DURATION)}
                {renderTh(PRICE)}
                {renderTh(STATUS)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : (
                tableData?.map((service: ServicePayload['service'], index: number) => {
                  const { id, name, duration, price, isActive } = service || {};
                  const ActiveStatus = isActive === true ? `${ACTIVE}` : `${INACTIVE}`
                  console.log(ActiveStatus);
                  console.log(isActive === true);
console.log(isActive);


                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{duration}</TableCell>
                      <TableCell scope="row">{price}</TableCell>
                      <TableCell className={classes.status} scope="row">{ActiveStatus}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>

                          <IconButton aria-label="delete" color="primary" size="small" onClick={() => onDeleteClick(id || '')}>
                            <TrashIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          {((!loading && tableData?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={SERVICE}
            isOpen={openDelete}
            isLoading={deleteServiceLoading}
            description={DELETE_SERVICE_DESCRIPTION}
            handleDelete={handleDeleteService}
            setOpen={(open: boolean) => setOpenDelete(open)}
          />
        </Box>
      </Box>
      {totalPage > 1 && (
        <Box display="flex" justifyContent="flex-end" pt={2.25}>
          <Pagination
            count={totalPage}
            shape="rounded"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default FacilityServicesTable;