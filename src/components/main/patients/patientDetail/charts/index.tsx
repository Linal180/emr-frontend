// packages block
import { FC } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@material-ui/core";

const AreaChartComponent: FC<any> = ({data}): JSX.Element => {

  return (
    <Box className="barChart2Container" mr={2}>
      <HighchartsReact highcharts={Highcharts} options={data} />
      </Box>
  )
};

export default AreaChartComponent;
