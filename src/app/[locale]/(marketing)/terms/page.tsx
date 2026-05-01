import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('terms');

export const generateMetadata = route.generateMetadata;
export default route.Page;
