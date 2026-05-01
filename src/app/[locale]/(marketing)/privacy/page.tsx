import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('privacy');

export const generateMetadata = route.generateMetadata;
export default route.Page;
