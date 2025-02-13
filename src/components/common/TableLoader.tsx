// packages block
import { FC } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { Table, TableBody, TableRow, TableCell } from "@material-ui/core";
// interfaces/types block
import { TableLoaderType } from "../../interfacesTypes";

const TableLoader: FC<TableLoaderType> = ({ numberOfRows, numberOfColumns }): JSX.Element => {
  return (
    <Table aria-label="customized table">
      <TableBody>
        {new Array(numberOfRows).fill(1).map((_, index) => (
          <TableRow key={`${index}-TableLoader`} className="table-loader-row">
            {new Array(numberOfColumns).fill(2).map((_, childIndex) => (
              <TableCell key={`${index}-TableCell-${childIndex}`}>
                <Skeleton />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableLoader;
