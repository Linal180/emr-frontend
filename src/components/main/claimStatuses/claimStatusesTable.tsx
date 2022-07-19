// packages block
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
// components block
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import Search from '../../common/Search';
import TableLoader from '../../common/TableLoader';
import ClaimStatusModal from '../../common/ClaimStatusModal';
import PageHeader from '../../common/PageHeader';
import ConfirmationModal from '../../common/ConfirmationModal';
import Alert from '../../common/Alert';
//constants, types, interfaces, utils block
import { EditNewIcon, TrashNewIcon } from '../../../assets/svgs';
import {
  ACTIONS, ADD_CLAIM_STATUS, CANT_DELETE_CLAIM_STATUS, CLAIM_STATUSES, CLAIM_STATUS_NEW_BREAD, CREATED_ON, DASHBOARD_BREAD,
  DELETE_CLAIM_STATUS_DESCRIPTION, NAME, PAGE_LIMIT
} from '../../../constants';
import {
  ClaimStatusesPayload, useFetchAllClaimStatusesLazyQuery, useRemoveClaimStatusMutation
} from '../../../generated/graphql';
import { GeneralFormProps } from '../../../interfacesTypes';
import { useTableStyles } from '../../../styles/tableStyles';
import {
  convertDateFromUnix, renderTh
} from '../../../utils';

const ClaimStatusesTable: FC<GeneralFormProps> = (): JSX.Element => {
  const classes = useTableStyles()
  const [claimStatuses, setClaimStatuses] = useState<ClaimStatusesPayload['claimStatuses']>()
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [claimStatusToRemove, setClaimStatusToRemove] = useState<string>('')
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [isClaimStatusModalOpen, setIsClaimStatusModalOpen] = useState(false)
  const [editId, setEditId] = useState<string>('')

  const search = (query: string) => setSearchQuery(query)

  const handleChange = (_: ChangeEvent<unknown>, page: number) => setPage(page)

  const [getClaimStatuses, { loading, error }] = useFetchAllClaimStatusesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      setClaimStatuses([])
    },

    onCompleted(data) {
      const { fetchAllClaimStatuses: fetchAllClaimStatusesResults } = data || {};

      if (fetchAllClaimStatusesResults) {
        const { claimStatuses, pagination } = fetchAllClaimStatusesResults
        if (pagination) {
          const { totalPages } = pagination

          typeof totalPages === 'number' && setTotalPages(totalPages)
        }

        claimStatuses && setClaimStatuses(claimStatuses as ClaimStatusesPayload['claimStatuses'])
      }
    }
  });

  const fetchClaimStatuses = useCallback(async () => {
    try {
      await getClaimStatuses({
        variables: {
          claimStatusPaginationInput: {
            paginationOptions: {
              page,
              limit: PAGE_LIMIT
            },
            searchString: searchQuery,
          }
        }
      })
    } catch (error) { }
  }, [getClaimStatuses, page, searchQuery])

  const [removeClaimStatus, { loading: removeClaimStatusLoading }] = useRemoveClaimStatusMutation({
    onError() {
      Alert.error(CANT_DELETE_CLAIM_STATUS)
    },

    async onCompleted(data) {
      if (data) {
        const { removeClaimStatus } = data
        const { response } = removeClaimStatus || {}

        if (response) {
          const { message } = response
          message && Alert.success(message);

          try {
            setOpenDelete(false)
            await fetchClaimStatuses()
          } catch (error) { }
        }
      }
    }
  });

  useEffect(() => {
    fetchClaimStatuses()
  }, [fetchClaimStatuses, searchQuery])

  const onDeleteClick = (id: string) => {
    if (id) {
      setClaimStatusToRemove(id)
      setOpenDelete(true)
    }
  };

  const handleClaimStatusDelete = async () => {
    claimStatusToRemove && await removeClaimStatus({
      variables: { id: claimStatusToRemove }
    })
  };

  useEffect(() => {
    if (!claimStatuses?.length && page > 1) {
      setPage(page - 1)
    }
  }, [claimStatuses?.length, page])


  return (
    <>
      <PageHeader
        title={CLAIM_STATUSES}
        path={[DASHBOARD_BREAD, CLAIM_STATUS_NEW_BREAD]}
        buttonText={ADD_CLAIM_STATUS}
        openModal={() => setIsClaimStatusModalOpen(!isClaimStatusModalOpen)}
      />

      <Box className={classes.mainTableContainer}>
        <Box maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow" mt={4}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(CREATED_ON)}
                {renderTh(ACTIONS, 'center')}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={3} />
                  </TableCell>
                </TableRow>
              ) : (
                claimStatuses?.map((claimStatus) => {
                  const { statusName, createdAt, id } = claimStatus ?? {}
                  return (
                    <TableRow>
                      <TableCell scope="row" >
                        {statusName}
                      </TableCell>

                      <TableCell scope="row">{convertDateFromUnix(createdAt, 'MM-DD-YYYY')}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Box className={classes.iconsBackground}
                            onClick={() => {
                              setEditId(id)
                              setIsClaimStatusModalOpen(true)
                            }}
                          >
                            <EditNewIcon />
                          </Box>
                          <Box className={classes.iconsBackground}
                            onClick={() => id && onDeleteClick(id)}
                          >
                            <TrashNewIcon />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                }
                ))}
            </TableBody>
          </Table>

          {((!loading && claimStatuses?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>

      <ConfirmationModal
        title={CLAIM_STATUSES}
        isOpen={openDelete}
        isLoading={removeClaimStatusLoading}
        description={DELETE_CLAIM_STATUS_DESCRIPTION}
        handleDelete={handleClaimStatusDelete}
        setOpen={(open: boolean) => setOpenDelete(open)}
      />

      {isClaimStatusModalOpen && <ClaimStatusModal
        isOpen={isClaimStatusModalOpen}
        setIsOpen={setIsClaimStatusModalOpen}
        id={editId}
        setEditId={setEditId}
        refetch={() => fetchClaimStatuses()}
      />}

      {totalPages > 1 && <Box display="flex" justifyContent="flex-end" p={3}>
        <Pagination
          count={totalPages}
          shape="rounded"
          variant="outlined"
          page={page}
          onChange={handleChange}
        />
      </Box>}
    </>
  )
}

export default ClaimStatusesTable;
