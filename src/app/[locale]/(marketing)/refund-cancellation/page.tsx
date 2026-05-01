import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('refundCancellation');

export const generateMetadata = route.generateMetadata;
export default route.Page;
