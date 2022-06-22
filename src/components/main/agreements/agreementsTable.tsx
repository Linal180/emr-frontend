// packages block
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
// components block
import Search from '../../common/Search';
import Alert from '../../common/Alert';
import ConfirmationModal from '../../common/ConfirmationModal';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import TableLoader from '../../common/TableLoader';
//constants, types, interfaces, utils block
import { EditNewIcon, TrashNewIcon } from '../../../assets/svgs';
import { ACTIONS, AGREEMENTS, AGREEMENTS_ROUTE, CANT_DELETE_AGREEMENT, CREATED_ON, DELETE_AGREEMENT_DESCRIPTION, INITIAL_PAGE_LIMIT, NAME } from '../../../constants';
import { AgreementsPayload, useFetchAllAgreementsLazyQuery, useRemoveAgreementMutation } from '../../../generated/graphql';
import { GeneralFormProps } from '../../../interfacesTypes';
import { useTableStyles } from '../../../styles/tableStyles';
import { WHITE } from '../../../theme';
import { convertDateFromUnix, renderTh } from '../../../utils';

const AgreementsTable: FC<GeneralFormProps> = (): JSX.Element => {
  const classes = useTableStyles()
  const [agreements, setAgreements] = useState<AgreementsPayload['agreements']>([])
  const [pages, setPages] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [agreementToRemove, setAgreementToRemove] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const search = (query: string) => { 
    setSearchQuery(query)
  };

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  const [fetchAllAgreements, { loading, error }] = useFetchAllAgreementsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      setAgreements([])
    },

    onCompleted(data) {
      const { fetchAllAgreements: fetchAllAgreementsResults } = data || {};

      if (fetchAllAgreementsResults) {
        const { agreements, pagination } = fetchAllAgreementsResults

        if (pagination) {
          const { totalPages } = pagination

          typeof totalPages === 'number' && setPages(totalPages)
        }

        agreements && setAgreements(agreements)

      }
    }
  });

  const fetchAgreements = useCallback(async () => {
    try {
      await fetchAllAgreements({
        variables: {
          agreementPaginationInput: {
            paginationOptions: {
              page,
              limit: INITIAL_PAGE_LIMIT
            },
            searchString: searchQuery
          }
        }
      })
    } catch (error) { }
  }, [fetchAllAgreements, page, searchQuery])

  const [removeAgreement, { loading: deleteAgreementLoading }] = useRemoveAgreementMutation({
    onError() {
      Alert.error(CANT_DELETE_AGREEMENT)
    },

    async onCompleted(data) {
      if (data) {
        const { removeAgreement: { response } } = data

        if (response) {
          const { message } = response

          message && Alert.success(message);
          try {
            setOpenDelete(false)
            await fetchAgreements()
          } catch (error) { }
        }
      }
    }
  });

  useEffect(() => {
    fetchAgreements()
  }, [fetchAgreements, searchQuery])

  const onDeleteClick = (id: string) => {
    if (id) {
      setAgreementToRemove(id)
      setOpenDelete(true)
    }
  };

  const handleAgreementDelete = async () => {
    if (agreementToRemove) {
      await removeAgreement({
        variables: {
          agreementId: agreementToRemove
        }
      })
    }
  };

  return (
    <>
      <Box bgcolor={WHITE}>
        <Box p={2} bgcolor={WHITE}>
          <Box py={2} maxWidth={450}>
            <Search search={search} />
          </Box>
        </Box>

        <Box bgcolor={WHITE} className="table-overflow agreement-table">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(CREATED_ON)}
                {renderTh(ACTIONS)}
              </TableRow>
            </TableHead>

            <TableBody>
              {(loading) ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={10} numberOfColumns={8} />
                  </TableCell>
                </TableRow>
              ) : (
                agreements?.map((agreement) => {
                  const { title, createdAt, id } = agreement ?? {}
                  return (
                    <TableRow>
                      <TableCell scope="row">{title}</TableCell>
                      <TableCell scope="row">{convertDateFromUnix(createdAt, 'MM-DD-YYYY')}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${AGREEMENTS_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

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

          {((!loading && agreements?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>

      <ConfirmationModal
        title={AGREEMENTS}
        isOpen={openDelete}
        isLoading={deleteAgreementLoading}
        description={DELETE_AGREEMENT_DESCRIPTION}
        handleDelete={handleAgreementDelete}
        setOpen={(open: boolean) => setOpenDelete(open)}
      />

      {pages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={pages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  )
}

export default AgreementsTable;
