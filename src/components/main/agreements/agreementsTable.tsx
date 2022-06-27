// packages block
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
// components block
import Alert from '../../common/Alert';
import ConfirmationModal from '../../common/ConfirmationModal';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import Search from '../../common/Search';
import DocViewer from './DocViewer';
import TableLoader from '../../common/TableLoader';
//constants, types, interfaces, utils block
import { EditNewIcon, EyeIcon, TrashNewIcon } from '../../../assets/svgs';
import { ACTIONS, AGREEMENTS, AGREEMENTS_ROUTE, CANT_DELETE_AGREEMENT, CREATED_ON, DELETE_AGREEMENT_DESCRIPTION, NAME, PAGE_LIMIT } from '../../../constants';
import { useFetchAllAgreementsLazyQuery, useGetAttachmentsByAgreementIdLazyQuery, useRemoveAgreementMutation } from '../../../generated/graphql';
import { GeneralFormProps } from '../../../interfacesTypes';
import { Action, ActionType, agreementReducer, initialState, State } from '../../../reducers/agreementReducer';
import { useTableStyles } from '../../../styles/tableStyles';
import { WHITE } from '../../../theme';
import { convertDateFromUnix, isFacilityAdmin, isPracticeAdmin, isSuperAdmin, renderTh } from '../../../utils';
import { AuthContext } from '../../../context';

const AgreementsTable: FC<GeneralFormProps> = (): JSX.Element => {
  const classes = useTableStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(agreementReducer, initialState)
  const { agreementToRemove, agreementUrl, agreements, isFileModalOpen, openDelete, page, pages, searchQuery } = state
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};
  const { id: facilityId, practice } = facility || {};
  const { id: practiceId } = practice || {}

  const isSuper = isSuperAdmin(roles)
  const isPrac = isPracticeAdmin(roles)
  const isFac = isFacilityAdmin(roles)

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
  };

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    dispatch({ type: ActionType.SET_PAGE, page: page })
  }

  const [fetchAllAgreements, { loading, error }] = useFetchAllAgreementsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_AGREEMENTS, agreements: [] })
    },

    onCompleted(data) {
      const { fetchAllAgreements: fetchAllAgreementsResults } = data || {};

      if (fetchAllAgreementsResults) {
        const { agreements, pagination } = fetchAllAgreementsResults
        if (pagination) {
          const { totalPages } = pagination


          typeof totalPages === 'number' && dispatch({ type: ActionType.SET_PAGES, pages: totalPages })
        }

        agreements && dispatch({ type: ActionType.SET_AGREEMENTS, agreements: agreements })

      }
    }
  });

  const fetchAgreements = useCallback(async () => {
    try {
      const agreementInputs = isSuper ? {} :
        isPrac ? { agreementPracticeId: practiceId } :
          isFac ? { agreementPracticeId: practiceId, agreementFacilityId: facilityId } : undefined

      await fetchAllAgreements({
        variables: {
          agreementPaginationInput: {
            paginationOptions: {
              page,
              limit: PAGE_LIMIT
            },
            searchString: searchQuery,
            ...(agreementInputs ? agreementInputs : {})
          }
        }
      })
    } catch (error) { }
  }, [facilityId, fetchAllAgreements, isFac, isPrac, isSuper, page, practiceId, searchQuery])

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
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
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
      dispatch({ type: ActionType.SET_AGREEMENT_TO_REMOVE, agreementToRemove: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
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

  const [getAttachments] = useGetAttachmentsByAgreementIdLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null;
    },

    async onCompleted(data) {
      if (data) {
        const { getAttachmentsByAgreementId } = data

        if (getAttachmentsByAgreementId) {
          const { attachmentsWithPreSignedUrl } = getAttachmentsByAgreementId
          const { preSignedUrl } = attachmentsWithPreSignedUrl?.[0] ?? {}
          if (preSignedUrl) {
            dispatch({ type: ActionType.SET_AGREEMENT_URL, agreementUrl: preSignedUrl })
            dispatch({ type: ActionType.SET_IS_FILE_MODAL_OPEN, isFileModalOpen: true })
          }
        }
      }
    },
  })

  const handleTitleClick = async (id: string) => {
    await getAttachments({
      variables: {
        getAttachmentsByAgreementId: {
          agreementId: id,
          typeId: id
        }
      },
    })
  }

  const handleModalClose = () => {
    dispatch({ type: ActionType.SET_IS_FILE_MODAL_OPEN, isFileModalOpen: false })
    dispatch({ type: ActionType.SET_AGREEMENT_URL, agreementUrl: '' })
  }

  useEffect(() => {
    if (!agreements.length && page > 1) {
      dispatch({ type: ActionType.SET_PAGE, page: page - 1 })
    }
  }, [agreements.length, page])


  return (
    <>
      <Box bgcolor={WHITE}>
        <Box p={2} bgcolor={WHITE}>
          <Box py={2} maxWidth={450}>
            <Search search={search} />
          </Box>
        </Box>

        <Box bgcolor={WHITE} className="table-overflow table-header">
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
                agreements?.map((agreement) => {
                  const { title, createdAt, id, body } = agreement ?? {}
                  return (
                    <TableRow>
                      <TableCell scope="row" >
                        {title}
                      </TableCell>
                      <TableCell scope="row">{convertDateFromUnix(createdAt, 'MM-DD-YYYY')}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Box className={`${classes.iconsBackground} ${!body ? '' : 'disable-icon'}`}>
                            <Button onClick={() => id && handleTitleClick(id)}>
                              <EyeIcon />
                            </Button>
                          </Box>

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
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
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

      {
        isFileModalOpen && <DocViewer
          handleClose={handleModalClose}
          isOpen={isFileModalOpen}
          url={agreementUrl}
          title="Agreement"
        />
      }
    </>
  )
}

export default AgreementsTable;
