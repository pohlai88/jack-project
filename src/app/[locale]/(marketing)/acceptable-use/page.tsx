import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('acceptableUse');

export const generateMetadata = route.generateMetadata;
export default route.Page;
