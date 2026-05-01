import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('complaints');

export const generateMetadata = route.generateMetadata;
export default route.Page;
