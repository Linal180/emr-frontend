import { Button } from "@material-ui/core";
import { ChangeEventHandler } from "react";
import { UploadIconNew } from "../../assets/svgs";
import { UPLOAD_CSV } from "../../constants";

export default function CsvReader({ handleFileUpload }: { handleFileUpload: ChangeEventHandler<HTMLInputElement> | undefined }) {

  const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }

  return (
    <>
      <Button
        component="label"
        variant="outlined"
        color="secondary"
        startIcon={<UploadIconNew />}
      >
        {UPLOAD_CSV}
        <input type="file" accept=".xlsx, .xls, .csv" onClick={onInputClick} hidden onChange={handleFileUpload} />
      </Button>
    </>
  );
}
