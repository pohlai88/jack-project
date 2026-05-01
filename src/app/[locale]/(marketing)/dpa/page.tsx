import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('dpa');

export const generateMetadata = route.generateMetadata;
export default route.Page;
