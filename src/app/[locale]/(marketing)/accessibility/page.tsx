import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('accessibility');

export const generateMetadata = route.generateMetadata;
export default route.Page;
