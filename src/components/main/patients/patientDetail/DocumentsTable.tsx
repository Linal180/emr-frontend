
// packages block
import { FC } from "react";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";

// components block
import { useTableStyles } from "../../../../styles/tableStyles";
import { ACTION, COMMENTS, DATE, PROVIDER, SIZE, TITLE, TYPE, DUMMY_DOCUMENTS } from "../../../../constants";
import { renderTh } from "../../../../utils";
import { DownloadIcon, EditNewIcon, PrinterIcon, SignedIcon, TrashNewIcon } from "../../../../assets/svgs";

const DocumentsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()

  return (
    <Box className="table-overflow">
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {renderTh(TITLE)}
            {renderTh(TYPE)}
            {renderTh(COMMENTS)}
            {renderTh(PROVIDER)}
            {renderTh(DATE)}
            {renderTh(SIZE)}
            {renderTh(ACTION, "center")}
          </TableRow>
        </TableHead>

        <TableBody>
          {DUMMY_DOCUMENTS.map(({
            title, type, comments, provider, date, size
          }) =>
            <TableRow>
              <TableCell scope="row">{title}</TableCell>
              <TableCell scope="row">{type}</TableCell>
              <TableCell scope="row">{comments}</TableCell>
              <TableCell scope="row">{provider}</TableCell>
              <TableCell scope="row">{date}</TableCell>
              <TableCell scope="row">{size}</TableCell>
              <TableCell scope="row">
                <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                  <Box className={classes.iconsBackground}>
                    <SignedIcon />
                  </Box>

                  <Box className={classes.iconsBackground}>
                    <EditNewIcon />
                  </Box>

                  <Box className={classes.iconsBackground}>
                    <DownloadIcon />
                  </Box>

                  <Box className={classes.iconsBackground}>
                    <PrinterIcon />
                  </Box>

                  <Box className={classes.iconsBackground}>
                    <TrashNewIcon />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default DocumentsTable;