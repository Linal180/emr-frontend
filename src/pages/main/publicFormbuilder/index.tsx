// packages block
import { FC } from "react";
// components block
import FormPreview from "../../../components/main/publicFormbuilder/preview";
import FormFail from "../../../components/main/publicFormbuilder/fail";

export const PublicFormPreview: FC = (): JSX.Element => <FormPreview />;
export const PublicFormFail: FC = (): JSX.Element => <FormFail />;
