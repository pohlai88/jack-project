import { createLegalDocumentPage } from '../_components/LegalPageContent';

const route = createLegalDocumentPage('responsibleDisclosure');

export const generateMetadata = route.generateMetadata;
export default route.Page;
