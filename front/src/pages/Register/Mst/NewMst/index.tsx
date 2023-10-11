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
import { SelectList } from '../../../../components/SelectList';
import { formatToOnlyNumbers } from '../../../../utils/formatToOnlyNumber';

export function NewMst() {
  const [mst, setMst] = useState<string>('');
  const [side, setSide] = useState<string>('');
  const [mstCode, setMstCode] = useState<string>('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const { t } = useTranslation();
  const language = localStorage.getItem('language');

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const navigate = useNavigate();

  const [languageLocal, setLanguageLocal] = useState(language);
  const [countError, setCountError] = useState(0);

  const isFormValid = errors.length === 0 && mst && !!side && mstCode;

  function goToMstList() {
    navigate(-1);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(
      event.target.value
        .replaceAll('/', '')
        .replaceAll('_', '')
        .replaceAll('.', '')
        .replaceAll('-', '')
        .trimStart()
        .trim(),
    );
    setMst(value);

    if (value.trim().length < 1) {
      setCountError(countError + 1);
      setError({
        field: `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
        message: `${t('validation-2-10-c')}`,
      });
    } else {
      setCountError(0);
      removeError(`${language === 'ptBR' ? 'errorPt' : 'errorEn'}`);
    }
  }

  function handleInputCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const regex = /[^0-9.]/g;
    const value = event.target.value;
    const result = value.replace(regex, '');
    setMstCode(result);

    if (result.trim().length < 1) {
      setCountError(countError + 1);
      setError({
        field: `${language === 'ptBR' ? 'errorPtCode' : 'errorEnCode'}`,
        message: `${t('validation-2-13-c')}`,
      });
    } else {
      setCountError(0);
      removeError(`${language === 'ptBR' ? 'errorPtCode' : 'errorEnCode'}`);
    }
  }

  useEffect(() => {
    if (language !== languageLocal && countError !== 0) {
      removeError(`${language === 'ptBR' ? 'errorEn' : 'errorPt'}`);
      setError({
        field: `${language === 'ptBR' ? 'errorPt' : 'errorEn'}`,
        message: `${t('validation-2-10-c')}`,
      });
      setError({
        field: `${language === 'ptBR' ? 'errorPtCode' : 'errorEnCode'}`,
        message: `${t('validation-2-13-c')}`,
      });
      setLanguageLocal(language);
    } else if (countError === 0) {
      setLanguageLocal(language);
      removeError(`${language === 'ptBR' ? 'errorPt' : 'errorEn'}`);
      removeError(`${language === 'ptBR' ? 'errorPtCode' : 'errorEnCode'}`);
    }
  }, [language]);

  async function onSaveFields() {
    const body = {
      mst_name: mst,
      mst_side: Number(side),
      mst_ip: mstCode,
      mst_status: true,
    };

    await Api.post('mst', body)

      .then(async () => {
        toast.success(t('mst-toast-new'));
        goToMstList();
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

  function handleListSideChange(event: any) {
    const value = event.target.value;
    setSide(value);
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

  return (
    <>
      <Container>
        <BreadCrumbs />
        <ModalConfirm
          isModalActive={isModalConfirmOpen}
          handleCancel={() => setIsModalConfirmOpen(false)}
          handleClose={() => {
            setIsModalConfirmOpen(false);
            goToMstList();
          }}
        />
        <h1>{t('mst-new')}</h1>
        <Wrapper>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
              }}
            >
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
                  label={t('input-mst')}
                  id="mst"
                  type="text"
                  value={mst}
                  width="100%"
                  maxLength={10}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1rem',
                }}
              >
                <div style={{ width: '100%' }}>
                  <FormGroup
                    error={getErrorMessageByFieldName(
                      `${language === 'ptBR' ? 'errorPtCode' : 'errorEnCode'}`,
                    )}
                    extraErrorMessage={['']}
                  >
                    <DefaultInput
                      error={getErrorMessageByFieldName(
                        `${
                          language === 'ptBR' ? 'errorPtCode' : 'errorEnCode'
                        }`,
                      )}
                      label={`${t('ip-mst')}*`}
                      id="mstCode"
                      type="text"
                      value={mstCode}
                      width="100%"
                      maxLength={13}
                      onChange={handleInputCodeChange}
                    />
                  </FormGroup>
                </div>

                <div style={{ width: '100%' }}>
                  <FormGroup
                    error={getErrorMessageByFieldName(
                      `${language === 'ptBR' ? 'errorPtSize' : 'errorEnSize'}`,
                    )}
                    extraErrorMessage={['']}
                  >
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
