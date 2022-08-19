
import { FC } from 'react';
import { Dialog } from '@material-ui/core';
//component
import CameraComponent from '../Camera';
//interface
import { CameraModalProps } from '../../../interfacesTypes';

const CameraModal: FC<CameraModalProps> = ({ open }): JSX.Element => {

  const uploadImage = async (file: Blob | null) => {
    // const formData = new FormData();
    // formData.append('file', file);
  };

  return (
    <Dialog open={open}>
      <CameraComponent sendFile={uploadImage} open={open} invisibleHandler={() => {}} />
    </Dialog>
  )
}

export default CameraModal