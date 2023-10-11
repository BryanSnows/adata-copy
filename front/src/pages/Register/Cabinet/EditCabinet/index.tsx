import { ModalProps } from '../../../Login/ModalFirstPassword/types';
import ReactDOM from 'react-dom';
import { ModalConfirm } from '../../../../components/Modal/ModalConfirm';
import { DefaultInput } from '../../../../components/Input/DefaultInput';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useErrors } from '../../../../context/hooks/useErrors';

import { ButtonMain } from '../../../../components/Button/ButtonMain';
import {
  Actions,
  Overlay,
  Form,
} from '../../../Login/ModalFirstPassword/styles';
import { useQuery } from 'react-query';
import { FormGroup } from '../../../../components/FormGroup';
import Api from '../../../../services/Api';
import { toast } from 'react-toastify';
import { CircularProgressPortal } from '../../../../components/Loader/CircularProgressPortal';
import { useTranslation } from 'react-i18next';
import { getCabinet } from '../../../../services/GlobalServices/cabinetServices';
import { SelectList } from '../../../../components/SelectList';
import { ContainerEdit } from './styles';
import { formatToOnlyNumbers } from '../../../../utils/formatToOnlyNumber';

export function ModalEditCabinet({
  isModalActive,
  closeModal,
  keyId,
}: ModalProps) {
  const [cabinet, setCabinet] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [side, setSide] = useState<string>('');

  const [id, setId] = useState<number | undefined>(0);
  const { t } = useTranslation();

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['keyId', id],
    () => getCabinet(id),
    {
      onSuccess: (dataOnSuccess) => {
        setCabinet(dataOnSuccess?.cabinet_name);
        setSide(dataOnSuccess?.cabinet_side);
      },

      keepPreviousData: false,
    },
  );

  useEffect(() => {
    setId(keyId);
  }, [id, keyId]);

  function handleCabinetInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(
      event.target.value
        .replaceAll('/', '')
        .replaceAll('.', '')
        .replaceAll('-', '')
        .replaceAll('_', '')
        .trimStart()
        ?.toUpperCase(),
    );
    setCabinet(value);

    if (value.trim().length < 1) {
      setError({
        field: `cabinet + ${id}`,
        message: `${t('validation-2-8-c')}`,
      });
    } else {
      removeError(`cabinet + ${id}`);
    }
  }

  function handleCancelModal() {
    refetch();
    setIsModalConfirmOpen(false);
  }

  function handleCloseModal() {
    closeModal();
    refetch();
    removeError(`cabinet + ${id}`);
    setIsModalConfirmOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onEditCabinet();
    await handleCloseModal();
  }

  async function onEditCabinet() {
    const payload = {
      cabinet_name: parseInt(cabinet.replace(/\D/g, '')).toString(),
      cabinet_side: Number(side),
    };

    await Api.put(`cabinet/${id}`, payload)
      .then(async () => {
        toast.success(t('cabinet-toast-edit'));
        await refetch();
        return Promise.resolve(true);
      })
      .catch((error) => {
        const code = error.response.data.code;
        const object = error.response.data.object;
        toast.error(t(`${object}`) + t(`${code}`));
        return Promise.reject(false);
      });
  }

  const sideList = [
    {
      value: '0',
      name: t('left'),
    },
    {
      value: '1',
      name: t('right'),
    },
  ];

  function handleListSideChange(event: any) {
    const value = event.target.value;
    setSide(value);
  }

  if (!isModalActive) {
    return null;
  }

  if (!data || isLoading || isFetching) {
    return <CircularProgressPortal />;
  }

  const isFormValid =
    (errors.length === 0 && cabinet !== data?.cabinet_name) ||
    Number(side) !== Number(data?.cabinet_side);

  const modalRoot = document.getElementById('modal') as HTMLElement;

  return ReactDOM.createPortal(
    <Overlay>
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={handleCancelModal}
        handleClose={handleCloseModal}
      />
      <ContainerEdit>
        <h1>{t('cabinet-edit')}</h1>
        <Form onSubmit={handleSubmit} noValidate autoComplete="off">
          <FormGroup
            error={getErrorMessageByFieldName(`cabinet + ${id}`)}
            extraErrorMessage={['']}
          >
            <DefaultInput
              error={getErrorMessageByFieldName(`cabinet + ${id}`)}
              label={t('input-cabinet')}
              id="cabinet"
              type="text"
              value={cabinet}
              width="100%"
              maxLength={8}
              minLength={1}
              onChange={handleCabinetInputChange}
              shrink
            />
          </FormGroup>

          <FormGroup extraErrorMessage={['']}>
            <SelectList
              onChangeValue={handleListSideChange}
              currentValue={side}
              label={t('cabinet-side')}
              width="100%"
              placeholder={t('cabinet-side')}
              data={sideList}
              id="mst"
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
