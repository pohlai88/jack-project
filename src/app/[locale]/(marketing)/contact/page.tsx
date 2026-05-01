import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('contact');

export const generateMetadata = route.generateMetadata;
export default route.Page;
