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
import { formatToOnlyNumberAndLetters } from '../../../../utils/formatToOnlyNumberAndLetters';
import { useTranslation } from 'react-i18next';

export function NewShift() {
  const [shift, setShift] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const { t } = useTranslation();
  const language = localStorage.getItem('language');

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const navigate = useNavigate();

  const [languageLocal, setLanguageLocal] = useState(language);
  const [countError, setCountError] = useState(0);

  const isFormValid = errors.length === 0 && shift;

  function goToShiftList() {
    navigate(-1);
  }

  function handleShiftInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumberAndLetters(
      event.target.value.replaceAll('/', '').replaceAll('_', '').trimStart(),
      ['º', '°'],
    );
    setShift(value);

    if (value.trim().length < 5) {
      setCountError(countError + 1);
      setError({
        field: `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
        message: `${t('validation-5-40-c')}`,
      });
    } else {
      setCountError(0);
      removeError(`${language === 'ptBR' ? 'errorPt' : 'errorEn'}`);
    }
  }

  useEffect(() => {
    if (language !== languageLocal && countError !== 0) {
      removeError(`${language === 'ptBR' ? 'errorEn' : 'errorPt'}`);
      setError({
        field: `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
        message: `${t('validation-5-40-c')}`,
      });
      setLanguageLocal(language);
    } else if (countError === 0) {
      setLanguageLocal(language);
      removeError(`${language === 'ptBR' ? 'errorPt' : 'errorEn'}`);
    }
  }, [language]);

  async function onSaveFields() {
    const body = {
      shift_name: shift,
    };

    await Api.post('shift', body)

      .then(async (res) => {
        toast.success(t('shift-toast-new'));
        goToShiftList();
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

  return (
    <>
      <Container>
        <BreadCrumbs />
        <ModalConfirm
          isModalActive={isModalConfirmOpen}
          handleCancel={() => setIsModalConfirmOpen(false)}
          handleClose={() => {
            setIsModalConfirmOpen(false);
            goToShiftList();
          }}
        />
        <h1>{t('shift-new')}</h1>
        <Wrapper>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
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
                label={t('input-shift')}
                id="shift"
                type="text"
                value={shift}
                width="100%"
                maxLength={40}
                minLength={5}
                onChange={handleShiftInputChange}
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
