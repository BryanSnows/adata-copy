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
import { getShift } from '../../../../services/GlobalServices/shiftServices';

export function ModalEditShift({
  isModalActive,
  closeModal,
  keyId,
}: ModalProps) {
  const [shift, setShift] = useState<string>('');
  const [difShift, setDifShift] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(0);
  const { t } = useTranslation();

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['keyId', id],
    () => getShift(id),
    {
      onSuccess: (dataOnSuccess) => {
        setShift(dataOnSuccess?.shift_name);
        setDifShift(dataOnSuccess?.shift_name);
      },

      keepPreviousData: false,
    },
  );

  useEffect(() => {
    setId(keyId);
  }, [id, keyId]);

  function handleShiftInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumberAndLetters(
      event.target.value.replaceAll('/', '').replaceAll('_', '').trimStart(),
      ['º', '°'],
    );
    setShift(value);

    if (value.trim().length < 5) {
      setError({
        field: `shift + ${id}`,
        message: `${t('validation-5-40-c')}`,
      });
    } else {
      removeError(`shift + ${id}`);
    }
  }

  function handleCancelModal() {
    setIsModalConfirmOpen(false);
  }

  function handleCloseModal() {
    closeModal();
    setIsModalConfirmOpen(false);
    refetch();
    removeError(`shift + ${id}`);
  }

  async function onEditShift() {
    const payload = {
      shift_name: shift,
    };

    await Api.put(`shift/${id}`, payload)
      .then(async () => {
        toast.success(t('shift-toast-edit'), {
          toastId: 'SHIFT_SUCCESS',
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
    await onEditShift();
    handleCloseModal();
  }

  if (!isModalActive) {
    return null;
  }

  if (!data || isLoading || isFetching) {
    return <CircularProgressPortal />;
  }

  const isFormValid =
    errors.length === 0 && shift && shift?.toUpperCase() !== difShift;

  const modalRoot = document.getElementById('modal') as HTMLElement;

  return ReactDOM.createPortal(
    <Overlay>
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={handleCancelModal}
        handleClose={handleCloseModal}
      />
      <ContainerEdit>
        <h1>{t('shift-edit')}</h1>
        <Form onSubmit={handleSubmit} noValidate autoComplete="off">
          <FormGroup
            error={getErrorMessageByFieldName(`shift + ${id}`)}
            extraErrorMessage={['']}
          >
            <DefaultInput
              error={getErrorMessageByFieldName(`shift + ${id}`)}
              label={t('input-shift')}
              id="shift"
              type="text"
              value={shift?.toUpperCase()}
              width="100%"
              maxLength={40}
              minLength={5}
              onChange={handleShiftInputChange}
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
