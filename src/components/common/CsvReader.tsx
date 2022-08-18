import { Button } from "@material-ui/core";
import { ChangeEventHandler } from "react";
import { UploadIcon } from "../../assets/svgs";

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
        startIcon={<UploadIcon />}
      >
        Upload CSV
        <input type="file" accept=".csv" onClick={onInputClick} hidden onChange={handleFileUpload} />
      </Button>
    </>
  );
}
