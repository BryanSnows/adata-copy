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
import { getMst } from './service';
import { FormGroup } from '../../../../components/FormGroup';
import Api from '../../../../services/Api';
import { toast } from 'react-toastify';
import { CircularProgressPortal } from '../../../../components/Loader/CircularProgressPortal';
import { useTranslation } from 'react-i18next';
import { SelectList } from '../../../../components/SelectList';
import { ContainerEdit } from './styles';
import { formatToOnlyNumbers } from '../../../../utils/formatToOnlyNumber';

interface Idif {
  side: number | string;
  code: string;
}

export function EditModalMst({ isModalActive, closeModal, keyId }: ModalProps) {
  const [mst, setMst] = useState<string>('');
  const [difMst, setDifMst] = useState<string>('');
  const [side, setSide] = useState<string>('');
  const [mstStatus, setMstStatus] = useState<boolean>(true);
  const [dif, setDif] = useState<Idif>({
    side: '',
    code: '',
  });
  const [mstCode, setMstCode] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [id, setId] = useState<number | undefined>(0);
  const { t } = useTranslation();

  const { setError, removeError, getErrorMessageByFieldName } = useErrors();

  const { data, isLoading, refetch } = useQuery(
    ['keyId', id],
    () => getMst(id),
    {
      onSuccess: (dataOnSuccess) => {
        setMstStatus(dataOnSuccess?.mst_status);
        setMstCode(dataOnSuccess?.mst_ip);
        setSide(`${dataOnSuccess?.mst_side}`);
        setDif({
          side: `${dataOnSuccess?.mst_side}`,
          code: dataOnSuccess?.mst_ip,
        });
        setMst(dataOnSuccess?.mst_name?.toUpperCase());
        setDifMst(dataOnSuccess?.mst_name);
      },

      keepPreviousData: false,
    },
  );

  useEffect(() => {
    setId(keyId);
  }, [id, keyId]);

  function handleInputCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const regex = /[^0-9.]/g;
    const value = event.target.value;
    const result = value.replace(regex, '');

    setMstCode(result);

    if (result.trim().length < 1) {
      setError({
        field: `mstCode + ${id}`,
        message: `${t('validation-2-13-c')}`,
      });
    } else {
      removeError(`mstCode + ${id}`);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(
      event.target.value
        .replaceAll('/', '')
        .replaceAll('_', '')
        .replaceAll('.', '')
        .replaceAll('-', '')
        .trimStart()
        ?.toUpperCase(),
    );
    setMst(value);

    if (value.trim().length < 1) {
      setError({
        field: `mst + ${id}`,
        message: `${t('validation-2-10-c')}`,
      });
    } else {
      removeError(`mst + ${id}`);
    }
  }

  function handleCancelModal() {
    setIsModalConfirmOpen(false);
  }

  function handleCloseModal() {
    refetch();
    closeModal();
    setIsModalConfirmOpen(false);
    removeError(`mst + ${id}`);
    removeError(`mstCode + ${id}`);
  }

  // const isFormValid = errors.length === 0 || mst || mstCode;

  const difItens =
    (mst !== difMst && mst) ||
    (dif.code !== mstCode && mstCode) ||
    (dif.side !== side && side);

  async function onEdit() {
    const payload = {
      mst_name: parseInt(mst.replace(/\D/g, '')).toString(),
      mst_side: Number(side),
      mst_ip: mstCode,
      mst_status: mstStatus,
    };

    await Api.put(`mst/${id}`, payload)
      .then(async () => {
        toast.success(t('mst-toast-edit'), {
          toastId: 'MST_SUCCESS',
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

  const modalRoot = document.getElementById('modal') as HTMLElement;

  return ReactDOM.createPortal(
    <Overlay>
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={handleCancelModal}
        handleClose={handleCloseModal}
      />
      <ContainerEdit>
        <h1>{t('mst-edit')}</h1>

        <Form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div
            style={{
              width: '100%',
              display: 'flex',
              gap: '1rem',
              flexDirection: 'column',
              marginBottom: '16px',
            }}
          >
            <FormGroup
              error={getErrorMessageByFieldName(`mst + ${id}`)}
              extraErrorMessage={['']}
            >
              <DefaultInput
                error={getErrorMessageByFieldName(`mst + ${id}`)}
                label={t('input-mst')}
                id="mst"
                type="text"
                value={mst}
                width="100%"
                maxLength={10}
                onChange={handleInputChange}
                shrink
              />
            </FormGroup>

            <div
              style={{
                width: '100%',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <div style={{ width: '100%' }}>
                <FormGroup
                  error={getErrorMessageByFieldName(`mstCode + ${id}`)}
                  extraErrorMessage={['']}
                >
                  <DefaultInput
                    error={getErrorMessageByFieldName(`mstCode + ${id}`)}
                    label={`${t('ip-mst')}*`}
                    id="mstCode"
                    type="text"
                    value={mstCode}
                    width="100%"
                    maxLength={13}
                    onChange={handleInputCodeChange}
                    shrink
                  />
                </FormGroup>
              </div>

              <div style={{ width: '100%' }}>
                <FormGroup extraErrorMessage={['']}>
                  <SelectList
                    onChangeValue={handleListSideChange}
                    currentValue={side}
                    label={t('mst-side')}
                    width="100%"
                    placeholder={t('mst-side')}
                    data={sideList}
                    id="mst"
                  />
                </FormGroup>
              </div>
            </div>
          </div>

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
              disabled={!difItens}
            />
          </Actions>
        </Form>
      </ContainerEdit>
    </Overlay>,
    modalRoot,
  );
}
