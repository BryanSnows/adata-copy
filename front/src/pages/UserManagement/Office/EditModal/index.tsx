import { ModalProps } from '../../../Login/ModalFirstPassword/types';
import ReactDOM from 'react-dom';
import { ModalConfirm } from '../../../../components/Modal/ModalConfirm';
import { DefaultInput } from '../../../../components/Input/DefaultInput';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useErrors } from '../../../../context/hooks/useErrors';
import { formatToOnlyNumberAndLetters } from '../../../../utils/formatToOnlyNumberAndLetters';
import { ButtonMain } from '../../../../components/Button/ButtonMain';
import {
  Actions,
  ContainerEdit,
  Overlay,
  Form,
} from '../../../Login/ModalFirstPassword/styles';
import { useQuery } from 'react-query';
import { FormGroup } from '../../../../components/FormGroup';
import Api from '../../../../services/Api';
import { toast } from 'react-toastify';
import { CircularProgressPortal } from '../../../../components/Loader/CircularProgressPortal';
import { useTranslation } from 'react-i18next';
import { getOffice } from '../../../../services/GlobalServices/officeServices';

export function ModalEditOffice({
  isModalActive,
  closeModal,
  keyId,
}: ModalProps) {
  const [office, setOffice] = useState<string>('');
  const [difOffice, setDifOffice] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(0);
  const { t } = useTranslation();

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const { data, isLoading, refetch } = useQuery(
    ['keyId', id],
    () => getOffice(id),
    {
      onSuccess: (dataOnSuccess) => {
        setOffice(dataOnSuccess?.oficce_name?.toUpperCase());
        setDifOffice(dataOnSuccess?.oficce_name);
      },

      keepPreviousData: false,
    },
  );

  useEffect(() => {
    setId(keyId);
  }, [id, keyId]);

  function handleOfficeInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumberAndLetters(
      event.target.value
        .replaceAll('/', '')
        .replaceAll('_', '')
        .trimStart()
        ?.toUpperCase(),
      ['.', '-'],
    );
    setOffice(value);

    if (value.trim().length < 5) {
      setError({
        field: `office + ${id}`,
        message: `${t('validation-5-40-c')}`,
      });
    } else {
      removeError(`office + ${id}`);
    }
  }

  function handleCancelModal() {
    setIsModalConfirmOpen(false);
  }

  function handleCloseModal() {
    refetch();
    closeModal();
    setIsModalConfirmOpen(false);
    removeError(`office + ${id}`);
  }

  async function onEdit() {
    const payload = {
      oficce_name: office,
    };

    await Api.put(`office/${id}`, payload)
      .then(async () => {
        toast.success(t('office-toast-edit'), {
          toastId: 'OFFICE_SUCCESS',
        });
        refetch();
        return Promise.resolve(true);
      })
      .catch((error) => {
        const code = error.response.data.code;
        const object = error.response.data.object;
        toast.error(t(`${object}`) + t(`${code}`));
        return Promise.reject(false);
      });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onEdit();
    handleCloseModal();
  }

  if (!isModalActive) {
    return null;
  }

  if (!data || isLoading) {
    return <CircularProgressPortal />;
  }

  const isFormValid = errors.length === 0 && office && office !== difOffice;

  const modalRoot = document.getElementById('modal') as HTMLElement;

  return ReactDOM.createPortal(
    <Overlay>
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={handleCancelModal}
        handleClose={handleCloseModal}
      />
      <ContainerEdit>
        <h1>{t('office-edit')}</h1>
        <Form onSubmit={handleSubmit} noValidate autoComplete="off">
          <FormGroup
            error={getErrorMessageByFieldName(`office + ${id}`)}
            extraErrorMessage={['']}
          >
            <DefaultInput
              error={getErrorMessageByFieldName(`office + ${id}`)}
              label={t('input-office')}
              id="office"
              type="text"
              value={office}
              width="100%"
              maxLength={40}
              onChange={handleOfficeInputChange}
              shrink
            />
          </FormGroup>

          <Actions>
            <ButtonMain
              secondaryStyle
              label={t('button-cancel')}
              type="button"
              onClick={() => setIsModalConfirmOpen(true)}
            />
            <ButtonMain
              label={t('button-save')}
              type="submit"
              disabled={!isFormValid}
            />
          </Actions>
        </Form>
      </ContainerEdit>
    </Overlay>,
    modalRoot,
  );
}
