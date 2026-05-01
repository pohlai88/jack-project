import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('billing');

export const generateMetadata = route.generateMetadata;
export default route.Page;
