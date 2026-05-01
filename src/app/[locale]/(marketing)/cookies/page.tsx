import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('cookies');

export const generateMetadata = route.generateMetadata;
export default route.Page;
