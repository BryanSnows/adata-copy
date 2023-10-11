import { useTranslation } from 'react-i18next';
import { ReactComponent as PdfFile } from '../../../assets/icons/pdf-file.svg';
import { ReactComponent as XlsFile } from '../../../assets/icons/xls-file.svg';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { ModalBase } from '../../../components/Modal/ModalBase';

import {
  Container,
  Content,
  FileBoxGroup,
  FileInfo,
  LinkField,
} from './styles';
import { IDocumentsViewAndDownload } from './types';

export function DocumentsDownload({
  isModalOpen,
  onRequestClose,
  documents,
  handleDownload,
  text,
}: IDocumentsViewAndDownload) {
  const { t } = useTranslation();
  return (
    <ModalBase isModalOpen={isModalOpen} onRequestClose={onRequestClose} active>
      <Container>
        <Content>
          <h1>{t('modal-export')}</h1>
          <FileBoxGroup>
            {/* <LinkField onClick={() => }>
              <PdfFile />
              <FileInfo>
                <p>{text}.pdf</p>
              </FileInfo>
            </LinkField> */}
            <LinkField onClick={handleDownload}>
              <XlsFile />
              <FileInfo>
                <p>{text}.xls</p>
              </FileInfo>
            </LinkField>
          </FileBoxGroup>

          <ButtonMain
            secondaryStyle
            label={t('back')}
            onClick={onRequestClose}
          />
        </Content>
      </Container>
    </ModalBase>
  );
}
