export interface IDocumentsViewAndDownload {
  isModalOpen: boolean;
  onRequestClose: () => void;
  documents?: Array<any>;
  handleDownload: (
    hashed_file_path: string,
    original_file_name: string,
  ) => void;
  text?: string;
}
