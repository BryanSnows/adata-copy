import { BreadCrumbs } from '../../../../components/BreadCrumbs';
import {
  ActionsButton,
  Container,
  Form,
  Wrapper,
} from '../../../../styles/global';
import { FormGroup } from '../../../../components/FormGroup';
import { useErrors } from '../../../../context/hooks/useErrors';
import { DefaultInput } from '../../../../components/Input/DefaultInput';
import { ButtonMain } from '../../../../components/Button/ButtonMain';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Api from '../../../../services/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ModalConfirm } from '../../../../components/Modal/ModalConfirm';
import { useTranslation } from 'react-i18next';
import { formatToOnlyNumbers } from '../../../../utils/formatToOnlyNumber';
import { SelectList } from '../../../../components/SelectList';

export function NewCabinet() {
  const [cabinet, setCabinet] = useState<string>('');
  const [errorCabinet, setErrorCabinet] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [side, setSide] = useState<string>('');
  const { t } = useTranslation();
  const language = localStorage.getItem('language');

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const navigate = useNavigate();

  const isFormValid = errors.length === 0 && cabinet !== '' && side !== '';

  useEffect(() => {
    if (errorCabinet) {
      removeError(`${language === 'ptBR' ? 'cabinet-En' : 'cabinet-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`,
        message: `${t('validation-2-8-c')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`);
    }
  }, [language, errorCabinet]);

  function goToCabinetList() {
    navigate(-1);
  }

  async function onSaveFields() {
    const body = {
      cabinet_name: cabinet,
      cabinet_side: Number(side),
    };

    await Api.post('cabinet', body)
      .then(async (res) => {
        toast.success(t('cabinet-toast-new'));
        goToCabinetList();
      })
      .catch((error) => {
        const code = error.response.data.code;
        const object = error.response.data.object;
        toast.error(t(`${object}`) + t(`${code}`));
      });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSaveFields();
  }

  function handleCabinetInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(event.target.value);
    setCabinet(value);

    if (value.trim().length < 1) {
      setErrorCabinet(true);
    } else {
      setErrorCabinet(false);
    }
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

  return (
    <>
      <Container>
        <BreadCrumbs />
        <ModalConfirm
          isModalActive={isModalConfirmOpen}
          handleCancel={() => setIsModalConfirmOpen(false)}
          handleClose={() => {
            setIsModalConfirmOpen(false);
            goToCabinetList();
          }}
        />
        <h1>{t('cabinet-new')}</h1>
        <Wrapper>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormGroup
              error={getErrorMessageByFieldName(
                `${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`,
              )}
              extraErrorMessage={['']}
            >
              <DefaultInput
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`,
                )}
                label={t('input-cabinet')}
                id="cabinet"
                type="text"
                value={cabinet}
                width="100%"
                maxLength={8}
                minLength={1}
                onChange={handleCabinetInputChange}
              />
            </FormGroup>
            <FormGroup
              error={getErrorMessageByFieldName(
                `${language === 'ptBR' ? 'errorPtSize' : 'errorEnSize'}`,
              )}
              extraErrorMessage={['']}
            >
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
            <ActionsButton>
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
            </ActionsButton>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
}
