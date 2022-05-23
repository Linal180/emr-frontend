// package block
import { ChangeEvent, FC, useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { Box, Table, TableRow, TableHead, TableBody, TableCell, useTheme } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useParams } from 'react-router';
//components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import ImagePreviewModal from '../imagePreviewModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
import UserPreviewModal from '../userFormPreview'
//constants interfaces
import { useTableStyles } from '../../../../styles/tableStyles';
import { useFormResponsesStyles } from '../../../../styles/formbuilder/responses';
import { getSortedFormElementLabel, renderTh } from '../../../../utils';
import { PAGE_LIMIT, VIEW, } from '../../../../constants';
import { FormElement, useFindAllUsersFormsLazyQuery, UserForms, UsersFormsElements } from '../../../../generated/graphql';
import { ParamsType } from '../../../../interfacesTypes';
//component
const ResponseTable: FC = (): JSX.Element => {
  //hooks
  const classes = useTableStyles();
  const responsesClasses = useFormResponsesStyles()
  const { id: formId } = useParams<ParamsType>()
  const theme = useTheme()
  //states
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery] = useState<string>('');
  const [forms, setForms] = useState<UserForms[]>([]);
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [sortedFormLabels, setSortedFormLabels] = useState<FormElement[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [userForms, setUserForms] = useState<UsersFormsElements[]>([])
  const [preview, setPreview] = useState<boolean>(false)
  //mutations & queries
  const [fetchAllUserFormResponses, { loading, error }] = useFindAllUsersFormsLazyQuery({
    onCompleted: (data) => {
      const { findAllUsersForms } = data || {};

      if (findAllUsersForms) {

        const { response, form, pagination } = findAllUsersForms;
        const { status, message } = response || {}

        if (status === 200) {

          const { userForms, formElements } = form || {}
          formElements && setFormElements(formElements)
          userForms && setForms(userForms);

          if (pagination) {

            const { totalPages } = pagination
            totalPages && setTotalPages(totalPages)
          }
        } else {
          message && Alert.error(message)
        }

      }
    },
    onError: () => {
      setForms([]);
    }
  })

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }

      if (formId) {
        const formInputs = { ...pageInputs, FormId: formId }
        await fetchAllUserFormResponses({
          variables: {
            userFormInput: { ...formInputs }
          },
        })
      }
      else {
        Alert.error('Please select a form')
      }
    } catch (error) { }
  }, [page, formId, fetchAllUserFormResponses])

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  useEffect(() => {
    !searchQuery && formId && fetchAllForms()
  }, [page, searchQuery, fetchAllForms, formId]);

  useMemo(() => {
    if (formElements?.length > 0 && forms?.length > 0) {
      const arr = getSortedFormElementLabel(forms, formElements)
      arr?.length > 0 && setSortedFormLabels(arr)
    }
  }, [forms, formElements])

  const imagePreviewHandler = (url: string) => {
    // setPreview(false)
    setImageUrl(url)
    setOpen(true)
  }

  const showMoreDataHandler = (data: UsersFormsElements[]) => {
    setUserForms(data)
    setPreview(true)
  }

  return (
    <Box className={classes.mainTableContainer}>
      <Box className="table-overflow">
        <Table>
          <TableHead>
            <TableRow>
              {sortedFormLabels?.map((ele, index) => {
                const { label, name } = ele || {}
                if (index <= 2) {
                  return renderTh(label || name)
                } if (index === 3) {
                  return renderTh('Action')
                }
                return ''
              })}
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
              forms?.map((response, i) => {
                const { FormId, id, userFormElements } = response

                return (
                  <TableRow key={`${id}-${FormId}`}>
                    {userFormElements?.map((responseElement, index) => {
                      const { arrayOfStrings, FormsElementsId, value, id: responseId, arrayOfObjects } = responseElement;
                      return (
                        <Fragment>
                          {index <= 2 &&
                            <TableCell key={`${FormsElementsId}-FormsElementsId-${id}`}>
                              {(value?.includes(`form builder/${formId}`) ?
                                <Box color={theme.palette.primary.main} className={responsesClasses.viewBtn} pl={2} onClick={() => imagePreviewHandler(value)}>
                                  {VIEW}
                                </Box>
                                : value) ||
                                <ul>
                                  {arrayOfObjects?.filter((arr) => arr.value === true)?.map((val) => {
                                    const { name } = val;
                                    return (
                                      <li key={`${id}-${name}-${responseId}-${index}-${FormId}`}>
                                        {name}
                                      </li>
                                    )
                                  }
                                  )}
                                  {arrayOfStrings?.map((val) => (
                                    <li key={`${id}-${val}-${responseId}-${index}-${FormId}`}>
                                      {val}
                                    </li>
                                  ))}
                                </ul>
                              }
                            </TableCell>}
                          {index === 2 && userFormElements && <TableCell>
                            <Box onClick={() => showMoreDataHandler(userFormElements)} color={theme.palette.primary.main} className={responsesClasses.viewBtn} pl={2}>
                              View more
                            </Box>
                          </TableCell>}
                        </Fragment>
                      )
                    })}

                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        {((!loading && !forms?.length) || error) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" p={3}>
            <Pagination
              count={totalPages}
              shape="rounded"
              variant="outlined"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )}
      </Box>
      <ImagePreviewModal open={open} closeModalHandler={() => setOpen(!open)} url={imageUrl} formId={formId} />
      <UserPreviewModal open={preview} closeModalHandler={() => setPreview(!preview)} formId={formId} userForms={userForms} formLabels={sortedFormLabels} imagePreviewHandler={imagePreviewHandler} />
    </Box>
  )
}

export default ResponseTable
