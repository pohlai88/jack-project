import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('trademarks');

export const generateMetadata = route.generateMetadata;
export default route.Page;
