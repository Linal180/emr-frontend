//packages block
import { useState, useEffect, ChangeEvent, useCallback } from 'react'
import { Pagination } from '@material-ui/lab';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, } from '@material-ui/core';
import { Link } from 'react-router-dom'
// components block
import Search from "../../../common/Search";
import TableLoader from '../../../common/TableLoader';
import FormPreviewModal from '../previewModal'
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//constants block
import { ACTION, CREATED_ON, FORM_BUILDER_COPY_TEMPLATE_ROUTE, NAME, PAGE_LIMIT, TYPE } from '../../../../constants';
import { FormPayload, FormType, LayoutJsonType, FormTabsInputs, useFindAllFormsLazyQuery } from '../../../../generated/graphql';
import { useTableStyles } from '../../../../styles/tableStyles';
import { getFormatDate, renderTh } from '../../../../utils';
import { CopyIcon, EyeIcon } from '../../../../assets/svgs';
//component
export const TemplatesTable = () => {
  const classes = useTableStyles()
  //states
  const [templates, setTemplates] = useState<FormPayload['form'][]>([])
  const [formPreviewData, setFormPreviewData] = useState<FormTabsInputs[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery] = useState<string>('');
  const [openPreview, setOpenPreview] = useState<boolean>(false)
  const [formName, setFormName] = useState<string>('')
  //mutations
  const [getAllFormTemplates, { loading, error }] = useFindAllFormsLazyQuery({
    onCompleted: (data) => {
      const { findAllForms } = data || {}
      const { forms, response, pagination } = findAllForms || {}
      const { status } = response || {}

      if (status === 200) {
        forms && setTemplates(forms)
      }

      if (pagination) {
        const { totalPages: pages } = pagination || {}
        pages && setTotalPages(pages)
      }
    },
    onError: () => {
      setTemplates([])
    }
  })

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const formInputs = { ...pageInputs, isSystemForm: true, formType: FormType.Template }
      await getAllFormTemplates({
        variables: {
          formInput: { ...formInputs }
        },
      })
    } catch (error) { }
  }, [getAllFormTemplates, page])

  useEffect(() => {
    !searchQuery && fetchAllForms()
  }, [page, searchQuery, fetchAllForms]);

  const onViewClick = (layout: LayoutJsonType | undefined, name: string | undefined) => {
    if (layout) {
      const { tabs } = layout;
      tabs?.length > 0 && setFormPreviewData(tabs)
      name && setFormName(name)
      setOpenPreview(true)
    }
  }

  const search = (query: string) => { }

  const previewCloseHandler = () => setOpenPreview(false)

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  return (
    <Box>
      <Box className={classes.mainTableContainer}>
        <Box py={2} mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(TYPE)}
                {renderTh(CREATED_ON)}
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
                templates?.map((record: FormPayload['form']) => {
                  const { id, type, name, layout, createdAt } = record || {};
                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">
                        {name}
                      </TableCell>
                      <TableCell scope="row">{type}</TableCell>
                      <TableCell scope="row">{getFormatDate(createdAt)}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${FORM_BUILDER_COPY_TEMPLATE_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <CopyIcon />
                            </Box>
                          </Link>
                          <Box className={classes.iconsBackground} onClick={() => { name && onViewClick(layout, name) }}>
                            <EyeIcon />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {((!loading && !templates?.length) || error) && (
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

          <FormPreviewModal open={openPreview} data={formPreviewData} closeModalHandler={previewCloseHandler} formName={formName} />
        </Box>
      </Box>
    </Box>

  )
}