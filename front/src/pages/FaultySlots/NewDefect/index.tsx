import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrors } from '../../../context/hooks/useErrors';
import { useNavigate } from 'react-router-dom';

import Api from '../../../services/Api';
import { toast } from 'react-toastify';
import {
  ActionsButton,
  Container,
  Form,
  Wrapper,
} from '../../../styles/global';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { ModalConfirm } from '../../../components/Modal/ModalConfirm';
import { FormGroup } from '../../../components/FormGroup';
import { DefaultInput } from '../../../components/Input/DefaultInput';
import { ButtonMain } from '../../../components/Button/ButtonMain';

import { useQuery } from 'react-query';
import { getAllCabinet } from '../../../services/GlobalServices/cabinetServices';
import { formatToOnlyNumbers } from '../../../utils/formatToOnlyNumber';
import { Select } from '../../../components/Input/Select';
import { useAuthGlobal } from '../../../context/AuthProvider/useAuthGlobal';

export function NewDefect() {
  const [pos, setPos] = useState<string>('');
  const [cabinet, setCabinet] = useState<any>();
  const [ErrorCabinet, setErrorCabinet] = useState(false);
  const [ErrorPosition, setErrorPosition] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const { t } = useTranslation();
  const language = localStorage.getItem('language');
  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();
  const navigate = useNavigate();

  const { userName } = useAuthGlobal();

  const isFormValid = errors.length === 0 && cabinet && pos;

  const queryCabinets = useQuery(['CABINET'], () => getAllCabinet());

  function goToDefecttList() {
    navigate(-1);
  }

  function handleCabinetInputChange(value: any) {
    setCabinet(value);

    if (!value) {
      setErrorCabinet(true);
    } else {
      setErrorCabinet(false);
    }
  }

  function handlePositionInputChange(event: ChangeEvent<HTMLInputElement>) {
    setPos(formatToOnlyNumbers(event.target.value.trimStart()));

    if (event.target.value.trim().length < 1) {
      setErrorPosition(true);
    } else {
      setErrorPosition(false);
    }
  }

  useEffect(() => {
    if (ErrorCabinet) {
      removeError(`${language === 'ptBR' ? 'cabinet-En' : 'cabinet-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`,
        message: `${t('validation-select')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`);
    }
    if (ErrorPosition) {
      removeError(`${language === 'ptBR' ? 'errorEn' : 'errorPt'}`);
      setError({
        field: `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
        message: `${t('validation-1-3-n')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'errorPt' : 'errorEn'}`);
    }
  }, [language, ErrorCabinet, ErrorPosition]);

  async function onSaveFields() {
    const body = {
      slot_defects: [
        { cabinet_name: cabinet?.value, position: pos, user_name: userName },
      ],
    };

    await Api.post('slot-defect', body)

      .then(async (res) => {
        toast.success(t('defect-toast-new'));
        goToDefecttList();
      })
      .catch((error) => {
        const code =
          error.response.data.code === 1000 ? 1007 : error.response.data.code;

        const object = error.response.data.object;

        toast.error(t(`${object}`) + t(`${code}`));
      });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSaveFields();
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
            goToDefecttList();
          }}
        />
        <h1>{t('slots-register')}</h1>
        <Wrapper>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <FormGroup
              error={getErrorMessageByFieldName(
                `${language === 'ptBR' ? 'cabinet-Pt' : 'cabinet-En'}`,
              )}
              extraErrorMessage={['']}
            >
              <Select
                error={ErrorCabinet}
                width="100%"
                id="cabinet"
                label={t('input-cabinet')}
                placeholder={t('input-cabinet-message')}
                values={queryCabinets?.data}
                value={cabinet}
                onChangeValue={handleCabinetInputChange}
              />
            </FormGroup>

            <FormGroup
              error={getErrorMessageByFieldName(
                `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
              )}
              extraErrorMessage={['']}
            >
              <DefaultInput
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
                )}
                label={t('input-position')}
                id="position"
                type="text"
                value={pos}
                width="100%"
                maxLength={3}
                minLength={1}
                onChange={handlePositionInputChange}
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
