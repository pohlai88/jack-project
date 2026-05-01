import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('security');

export const generateMetadata = route.generateMetadata;
export default route.Page;
