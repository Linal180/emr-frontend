// packages block
import { Box, Button, Typography } from '@material-ui/core';
// components block
import AuditLogTable from './auditLogTable';
//constants bock
import { DownloadIconWhite } from '../../../assets/svgs';
import { AUDIT_LOG_REPORT, EXPORT_TO_FILE, } from '../../../constants';

const AuditLogComponent = (): JSX.Element => {

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{AUDIT_LOG_REPORT}</Typography>

        <Button variant="contained" startIcon={<DownloadIconWhite />} color="primary">
          {EXPORT_TO_FILE}
        </Button>
      </Box>

      <AuditLogTable />
    </>
  )
}

export default AuditLogComponent;
