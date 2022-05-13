// packages block
import { FC } from "react";
import DocViewer from "react-doc-viewer";

interface FileViewerProps {
  file: string
  type: string
}

const FileViewerComponent: FC<FileViewerProps> = ({ file, type }) => {

  return <DocViewer
    documents={[{ uri: file, fileType: type }]}
  />
}

export default FileViewerComponent;
