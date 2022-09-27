// packages block
import { FC, Reducer, useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, Table, TableBody, TableHead, TableRow, TableCell, Typography } from "@material-ui/core";
//components block
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
import MediaCards from '../../../common/AddMedia/MediaCards';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
// interfaces, graphql, constants block
import { GREY } from '../../../../theme';
import history from '../../../../history';
import { renderTh } from '../../../../utils';
import { SaveIcon, TrashNewIcon } from '../../../../assets/svgs';
import { useTableStyles } from '../../../../styles/tableStyles';
import {
  Action, ActionType, initialState, mediaReducer, State
} from '../../../../reducers/mediaReducer';
import {
  GeneralFormProps, LabOrderResultsAttachmentInput, ParamsType
} from "../../../../interfacesTypes";
import {
  ACTION, ADD_RESULT_FILE, ATTACHMENT_TITLES, COMMENTS, DELETE_LAB_ORDER_RESULT_DESCRIPTION,
  LAB_RESULTS_LIMIT, NOT_FOUND_EXCEPTION, RESULT_FILE_NAME, USER_NOT_FOUND_EXCEPTION_MESSAGE,
  LAB_ORDER_RESULT,
  LAB_TEXT,
} from '../../../../constants';
import {
  AttachmentsPayload, AttachmentType, useFetchDocumentTypeByNameLazyQuery, useGetAttachmentsByLabOrderLazyQuery,
  useRemoveAttachmentMediaMutation, useUpdateAttachmentDataMutation
} from '../../../../generated/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { labOrdersResultAttachmentSchema } from '../../../../validationSchemas';

const LabOrdersResultAttachment: FC<GeneralFormProps> = (): JSX.Element => {
  const classes = useTableStyles()
  const { orderNum, patientId } = useParams<ParamsType>();
  const methods = useForm<LabOrderResultsAttachmentInput>({ mode: "all", resolver: yupResolver(labOrdersResultAttachmentSchema) });

  const { handleSubmit, setValue } = methods
  const [{ attachmentUrl, attachmentData, isEdit, attachmentId, openDelete, labDocumentTypeId, labResultId, labOrderAttachments }, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

  const [removeAttachmentMedia, { loading: removeAttachmentLoading }] = useRemoveAttachmentMediaMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      Alert.success('Lab Result File Deleted Successfully')
      fetchAttachmentsByLabOrder()
    }
  });

  const [updateAttachmentData] = useUpdateAttachmentDataMutation({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
      Alert.error(message);
    },

    onCompleted(data) {
      const { updateAttachmentData } = data

      if (updateAttachmentData) {
        const { response } = updateAttachmentData || {}

        if (response) {
          const { status, message } = response

          if (message && status && status === 200) {
            Alert.success(message)
            dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
            fetchAttachmentsByLabOrder()
          }
        }
      }
    }
  })

  const [getAttachmentsByLabOrder, { loading, error }] = useGetAttachmentsByLabOrderLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`/patients/${patientId}/details/1`)
    },

    async onCompleted(data) {
      const { getAttachmentsByLabOrder } = data || {};

      if (getAttachmentsByLabOrder) {
        const { attachments } = getAttachmentsByLabOrder

        dispatch({ type: ActionType.SET_LAB_ORDER_ATTACHMENTS, labOrderAttachments: attachments as AttachmentsPayload['attachments'] })
      }
    }
  });

  const [fetchDocumentType] = useFetchDocumentTypeByNameLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      name: LAB_TEXT
    },

    onCompleted(data) {
      if (data) {
        const { fetchDocumentTypeByName } = data ?? {}
        const { documentType } = fetchDocumentTypeByName ?? {}
        const { id } = documentType ?? {}
        dispatch({ type: ActionType.SET_LAB_DOCUMENT_TYPE_ID, labDocumentTypeId: id || '' })
      }
    }
  })

  useEffect(() => {
    fetchDocumentType()
  }, [fetchDocumentType])

  const fetchAttachmentsByLabOrder = useCallback(async () => {
    try {
      await getAttachmentsByLabOrder({
        variables: {
          getAttachmentsByLabOrder: {
            orderNum: orderNum ?? '',
            typeId: patientId ?? ''
          }
        }
      });
    } catch (error) { }
  }, [getAttachmentsByLabOrder, orderNum, patientId])

  useEffect(() => {
    fetchAttachmentsByLabOrder()
  }, [fetchAttachmentsByLabOrder])

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_LAB_RESULT_ID, labResultId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleFileDeletion = async () => {
    await removeAttachmentMedia({
      variables: {
        id: labResultId
      }
    })

    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
  }

  const handleEdit = (attachmentId: string, name: string) => {
    if (attachmentId) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId })
      setValue('comments', name)
    }
  }

  const handleAttachmentNameEdit = (attachmentId: string, name: string) => {
    if (attachmentId) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId })
      setValue('attachmentName', name)
    }
  }

  const onSubmit: SubmitHandler<LabOrderResultsAttachmentInput> = async (values) => {
    const { comments, attachmentName } = values ?? {}
    attachmentId && await updateAttachmentData({
      variables: { updateAttachmentInput: { id: attachmentId, comments, attachmentName: attachmentName } }
    })
  }

  return (
    <Card>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(() => { })}>
          <Box className="table-overflow">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {renderTh(RESULT_FILE_NAME)}
                  {renderTh(COMMENTS)}
                  {renderTh(ACTION, "center")}
                </TableRow>
              </TableHead>

              <TableBody>
                {(loading) ? (
                  <TableRow>
                    <TableCell colSpan={10}>
                      <TableLoader numberOfRows={10} numberOfColumns={5} />
                    </TableCell>
                  </TableRow>
                ) : (
                  labOrderAttachments?.map((labOrderAttachment) => {
                    const { attachmentName, id, attachmentMetadata } = labOrderAttachment || {};
                    const { comments } = attachmentMetadata || {}

                    return (
                      <TableRow key={id}>
                        <TableCell scope="row">
                          <Box p={2} border={`1px solid ${GREY}`} borderRadius={4}>
                            {isEdit && attachmentId === id ? <>
                              <InputController
                                fieldType="text"
                                controllerName='attachmentName'
                                controllerLabel={''}
                                margin={'none'}
                              />
                            </>
                              :
                              <Box onClick={() => handleAttachmentNameEdit(id || '', attachmentName || '')}>
                                <Typography variant='body2'>{attachmentName}</Typography>
                              </Box>
                            }
                          </Box>
                        </TableCell>
                        <TableCell scope="row">
                          <Box p={2} border={`1px solid ${GREY}`} borderRadius={4}>
                            {isEdit && attachmentId === id ? <>
                              <InputController
                                fieldType="text"
                                controllerName={'comments'}
                                controllerLabel={''}
                                margin={'none'}
                                multiline
                              />
                            </>
                              :
                              <Box onClick={() => handleEdit(id || '', comments || '')}>
                                <Typography variant='body2'>{comments || 'Add Comments here'}</Typography>
                              </Box>
                            }
                          </Box>
                        </TableCell>

                        <TableCell scope="row">
                          <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">

                            {isEdit && attachmentId === id && <Box className={classes.iconsBackground} onClick={handleSubmit(onSubmit)}>
                              <SaveIcon />
                            </Box>}

                            <Box className={classes.iconsBackground} onClick={() => onDeleteClick(labOrderAttachment?.id || '')}>
                              <TrashNewIcon />
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>

            {((!loading && labOrderAttachments?.length === 0) || error) && (
              <Box display="flex" justifyContent="center" pb={12} pt={5}>
                <NoDataFoundComponent />
              </Box>
            )}

            <MediaCards
              itemId={patientId ?? ''}
              button={true}
              notDescription={true}
              imageSide={attachmentUrl}
              buttonText={ADD_RESULT_FILE}
              moduleType={AttachmentType.Patient}
              title={ATTACHMENT_TITLES.LabOrders}
              attachmentData={attachmentData || undefined}
              filesLimit={LAB_RESULTS_LIMIT}
              reload={() => fetchAttachmentsByLabOrder()}
              attachmentMetadata={{ labDocumentTypeId, labOrderNum: orderNum }}
            />

            <ConfirmationModal
              title={LAB_ORDER_RESULT}
              isOpen={openDelete}
              isLoading={removeAttachmentLoading}
              description={DELETE_LAB_ORDER_RESULT_DESCRIPTION}
              handleDelete={handleFileDeletion}
              setOpen={(openDelete: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: openDelete })}
            />
          </Box>
        </form>
      </FormProvider>
    </Card>
  );
};

export default LabOrdersResultAttachment;
