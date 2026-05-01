import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('subprocessors');

export const generateMetadata = route.generateMetadata;
export default route.Page;
