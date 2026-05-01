import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('serviceAvailability');

export const generateMetadata = route.generateMetadata;
export default route.Page;
