import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BreadCrumbs } from '../../../../components/BreadCrumbs';
import { ButtonMain } from '../../../../components/Button/ButtonMain';
import { FormGroup } from '../../../../components/FormGroup';
import { DefaultInput } from '../../../../components/Input/DefaultInput';
import { Select } from '../../../../components/Input/Select';
import { CircularProgressPortal } from '../../../../components/Loader/CircularProgressPortal';
import { ModalConfirm } from '../../../../components/Modal/ModalConfirm';
import { useErrors } from '../../../../context/hooks/useErrors';
import Api from '../../../../services/Api';
import {
  fetchOffice,
  fetchProfile,
  fetchShift,
} from '../../../../services/GlobalServices/userServices';
import {
  ActionsButton,
  Container,
  Form,
  Wrapper,
} from '../../../../styles/global';
import { formatToOnlyLetters } from '../../../../utils/formatToOnlyLetters';
import { formatToOnlyNumbers } from '../../../../utils/formatToOnlyNumber';
import { BoxGrid, BoxName } from './style';

export function NewUser() {
  const [profile, setProfile] = useState<any>();
  const [office, setOffice] = useState<any>();
  const [shift, setShift] = useState<any>();
  const [userName, setUserName] = useState('');
  const [mesID, setMesID] = useState('');
  const [userEnrollment, setUserEnrollment] = useState('');
  const [email, setEmail] = useState('');
  const today = new Date();
  const [password, setPassword] = useState(`adata@${today.getFullYear()}`);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const { t } = useTranslation();

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();
  const navigate = useNavigate();
  const [ErrorName, setErrorName] = useState(false);
  const [ErrorEnrollment, setErrorEnrollment] = useState(false);
  const [ErrorProfile, setErrorProfile] = useState(false);
  const [ErrorMes, setErrorMes] = useState(false);
  const [ErrorOffice, setErrorOffice] = useState(false);
  const [ErrorShift, setErrorShift] = useState(false);
  const [ErrorEmail, setErrorEmail] = useState(false);
  const [ErrorPassNumber, setErrorPassNumber] = useState(false);
  const [ErrorPassCar, setErrorPassCar] = useState(false);
  const [ErrorPassLet, setErrorPassLet] = useState(false);
  const [ErrorPass, setErrorPass] = useState(false);
  const language = localStorage.getItem('language');

  const queryProfile = useQuery(['PROFILE'], () => fetchProfile());

  const queryOffice = useQuery(['OFFICE'], () => fetchOffice());

  const queryShift = useQuery(['SHIFT'], () => fetchShift());

  const isFormValid =
    errors.length === 0 &&
    userName &&
    userEnrollment &&
    profile &&
    office &&
    shift &&
    password &&
    mesID;

  function handleUserInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyLetters(event.target.value.trimStart());

    setUserName(value);

    if (!event.target.value || value.trim().length < 4) {
      setErrorName(true);
    } else {
      setErrorName(false);
    }
  }

  function handleEnrollmentInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(event.target.value);
    setUserEnrollment(value);

    if (!event.target.value || value.length < 6) {
      setErrorEnrollment(true);
    } else {
      setErrorEnrollment(false);
    }
  }

  function handleMesInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(event.target.value);
    setMesID(value);

    if (!event.target.value || value.length < 2) {
      setErrorMes(true);
    } else {
      setErrorMes(false);
    }
  }

  function handleProfileInputChange(value: any) {
    setProfile(value);

    if (!value) {
      setErrorProfile(true);
    } else {
      setErrorProfile(false);
    }
  }

  function handleOfficeInputChange(value: any) {
    setOffice(value);

    if (!value) {
      setErrorOffice(true);
    } else {
      setErrorOffice(false);
    }
  }

  function handleShiftInputChange(value: any) {
    setShift(value);

    if (!value) {
      setErrorShift(true);
    } else {
      setErrorShift(false);
    }
  }

  function handleEmailInputChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value.trim());

    const regex_email =
      /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;

    if (event.target.value && !regex_email.test(event.target.value.trim())) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
  }

  function handlePasswordInputChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value.trim());

    const regex_number = /\d+/;
    const regex_caractere = /\W|_/;
    const regex_alf = /[ a-zA-Z áéíóúâÁÉÍÓÚâêôÂÊÔÃã]/;

    if (!regex_caractere.test(event.target.value)) {
      setErrorPassCar(true);
    } else {
      setErrorPassCar(false);
    }
    if (!regex_alf.test(event.target.value)) {
      setErrorPassLet(true);
    } else {
      setErrorPassLet(false);
    }

    if (!event.target.value || event.target.value.trim().length < 6) {
      setErrorPass(true);
    } else {
      setErrorPass(false);
    }

    if (!regex_number.test(event.target.value)) {
      setErrorPassNumber(true);
    } else {
      setErrorPassNumber(false);
    }
  }

  function goToUserList() {
    navigate('/user-management/users');
  }

  async function onSaveFields() {
    const body = {
      user_name: userName,
      office_id: office?.id,
      user_enrollment: userEnrollment,
      user_profile_id: profile?.id,
      user_shift_id: shift?.id,
      user_password: password,
      user_email: email,
      user_mes_id: mesID,
    };

    await Api.post('user', body)

      .then(async (res) => {
        toast.success(t('user-toast-new'));
        goToUserList();
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

  useEffect(() => {
    if (ErrorName) {
      removeError(`${language === 'ptBR' ? 'user-name-En' : 'user-name-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'user-name-Pt' : 'user-name-En'}`,
        message: `${t('validation-4-40-l')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'user-name-Pt' : 'user-name-En'}`);
    }
    if (ErrorEnrollment) {
      removeError(
        `${language === 'ptBR' ? 'user-enrollment-En' : 'user-enrollment-Pt'}`,
      );
      setError({
        field: `${
          language === 'ptBR' ? 'user-enrollment-Pt' : 'user-enrollment-En'
        }`,
        message: `${t('validation-6-8-n')}`,
      });
    } else {
      removeError(
        `${language === 'ptBR' ? 'user-enrollment-Pt' : 'user-enrollment-En'}`,
      );
    }
    if (ErrorMes) {
      removeError(`${language === 'ptBR' ? 'user-mes-En' : 'user-mes-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'user-mes-Pt' : 'user-mes-En'}`,
        message: `${t('validation-2-8-n')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'user-mes-Pt' : 'user-mes-En'}`);
    }
    if (ErrorProfile) {
      removeError(
        `${language === 'ptBR' ? 'user-profile-En' : 'user-profile-Pt'}`,
      );
      setError({
        field: `${language === 'ptBR' ? 'user-profile-Pt' : 'user-profile-En'}`,
        message: `${t('validation-select')}`,
      });
    } else {
      removeError(
        `${language === 'ptBR' ? 'user-profile-Pt' : 'user-profile-En'}`,
      );
    }
    if (ErrorOffice) {
      removeError(
        `${language === 'ptBR' ? 'user-office-En' : 'user-office-Pt'}`,
      );
      setError({
        field: `${language === 'ptBR' ? 'user-office-Pt' : 'user-office-En'}`,
        message: `${t('validation-select')}`,
      });
    } else {
      removeError(
        `${language === 'ptBR' ? 'user-office-Pt' : 'user-office-En'}`,
      );
    }
    if (ErrorShift) {
      removeError(`${language === 'ptBR' ? 'user-shift-En' : 'user-shift-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'user-shift-Pt' : 'user-shift-En'}`,
        message: `${t('validation-select')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'user-shift-Pt' : 'user-shift-En'}`);
    }
    if (ErrorEmail) {
      removeError(`${language === 'ptBR' ? 'user-email-En' : 'user-email-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'user-email-Pt' : 'user-email-En'}`,
        message: `${t('validation-email')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'user-email-Pt' : 'user-email-En'}`);
    }
    if (ErrorPass) {
      removeError(`${language === 'ptBR' ? 'pass-En' : 'pass-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'pass-Pt' : 'pass-En'}`,
        message: `${t('validation-6-12-c')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'pass-Pt' : 'pass-En'}`);
    }
    if (ErrorPassCar) {
      removeError(`${language === 'ptBR' ? 'pass-car-En' : 'pass-car-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'pass-car-Pt' : 'pass-car-En'}`,
        message: `${t('validation-special')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'pass-car-Pt' : 'pass-car-En'}`);
    }
    if (ErrorPassLet) {
      removeError(`${language === 'ptBR' ? 'pass-let-En' : 'pass-let-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'pass-let-Pt' : 'pass-let-En'}`,
        message: `${t('validation-let')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'pass-let-Pt' : 'pass-let-En'}`);
    }
    if (ErrorPassNumber) {
      removeError(`${language === 'ptBR' ? 'pass-num-En' : 'pass-num-Pt'}`);
      setError({
        field: `${language === 'ptBR' ? 'pass-num-Pt' : 'pass-num-En'}`,
        message: `${t('validation-n')}`,
      });
    } else {
      removeError(`${language === 'ptBR' ? 'pass-num-Pt' : 'pass-num-En'}`);
    }
  }, [
    ErrorName,
    ErrorEnrollment,
    ErrorProfile,
    ErrorOffice,
    ErrorShift,
    ErrorEmail,
    ErrorPass,
    ErrorPassCar,
    ErrorPassNumber,
    language,
    ErrorPassLet,
    ErrorMes,
  ]);

  return (
    <>
      <Container>
        <BreadCrumbs />
        <ModalConfirm
          isModalActive={isModalConfirmOpen}
          handleCancel={() => setIsModalConfirmOpen(false)}
          handleClose={() => {
            setIsModalConfirmOpen(false);
            goToUserList();
          }}
        />
        <h1>{t('user-new')}</h1>
        <Wrapper>
          <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <BoxName>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'user-name-Pt' : 'user-name-En'}`,
                )}
                extraErrorMessage={['']}
              >
                <DefaultInput
                  error={getErrorMessageByFieldName(
                    `${language === 'ptBR' ? 'user-name-Pt' : 'user-name-En'}`,
                  )}
                  label={t('input-collaborator')}
                  id="user-name"
                  type="text"
                  key={'user-name'}
                  value={userName}
                  width="100%"
                  maxLength={40}
                  minLength={4}
                  onChange={handleUserInputChange}
                />
              </FormGroup>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${
                    language === 'ptBR'
                      ? 'user-enrollment-Pt'
                      : 'user-enrollment-En'
                  }`,
                )}
                extraErrorMessage={['']}
              >
                <DefaultInput
                  error={getErrorMessageByFieldName(
                    `${
                      language === 'ptBR'
                        ? 'user-enrollment-Pt'
                        : 'user-enrollment-En'
                    }`,
                  )}
                  label={t('input-enrollment')}
                  id="enrollment"
                  value={userEnrollment}
                  width="100%"
                  maxLength={8}
                  minLength={4}
                  onChange={handleEnrollmentInputChange}
                />
              </FormGroup>
            </BoxName>
            <BoxGrid>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${
                    language === 'ptBR' ? 'user-profile-Pt' : 'user-profile-En'
                  }`,
                )}
                extraErrorMessage={['']}
              >
                <Select
                  error={ErrorProfile}
                  width="100%"
                  id="profile"
                  label={t('input-profile')}
                  placeholder={t('input-profile-message')}
                  values={queryProfile?.data}
                  currentValue={profile}
                  onChangeValue={handleProfileInputChange}
                />
              </FormGroup>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'user-mes-Pt' : 'user-mes-En'}`,
                )}
                extraErrorMessage={['']}
              >
                <DefaultInput
                  error={getErrorMessageByFieldName(
                    `${language === 'ptBR' ? 'user-mes-Pt' : 'user-mes-En'}`,
                  )}
                  label={`${t('input-mes')}*`}
                  id="mes"
                  value={mesID}
                  width="100%"
                  maxLength={8}
                  minLength={2}
                  onChange={handleMesInputChange}
                />
              </FormGroup>
            </BoxGrid>
            <BoxGrid>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${
                    language === 'ptBR' ? 'user-office-Pt' : 'user-office-En'
                  }`,
                )}
                extraErrorMessage={['']}
              >
                <Select
                  error={ErrorOffice}
                  width="100%"
                  id="office"
                  label={t('input-office')}
                  placeholder={t('input-office-message')}
                  values={queryOffice?.data}
                  currentValue={office}
                  onChangeValue={handleOfficeInputChange}
                />
              </FormGroup>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'user-shift-Pt' : 'user-shift-En'}`,
                )}
                extraErrorMessage={['']}
              >
                <Select
                  error={ErrorShift}
                  width="100%"
                  id="shift"
                  label={t('input-shift')}
                  placeholder={t('input-shift-message')}
                  values={queryShift?.data}
                  currentValue={shift}
                  onChangeValue={handleShiftInputChange}
                />
              </FormGroup>
            </BoxGrid>
            <BoxGrid>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'user-email-Pt' : 'user-email-En'}`,
                )}
                extraErrorMessage={['']}
              >
                <DefaultInput
                  error={getErrorMessageByFieldName(
                    `${
                      language === 'ptBR' ? 'user-email-Pt' : 'user-email-En'
                    }`,
                  )}
                  label={t('input-email')}
                  id="email"
                  value={email}
                  width="100%"
                  onChange={handleEmailInputChange}
                />
              </FormGroup>
              <FormGroup
                error={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'pass-Pt' : 'pass-En'}`,
                )}
                errorPasswordNumber={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'pass-num-Pt' : 'pass-num-En'}`,
                )}
                errorPasswordCaracter={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'pass-car-Pt' : 'pass-car-En'}`,
                )}
                errorPasswordLet={getErrorMessageByFieldName(
                  `${language === 'ptBR' ? 'pass-let-Pt' : 'pass-let-En'}`,
                )}
                extraErrorMessage={['']}
              >
                <DefaultInput
                  error={
                    getErrorMessageByFieldName(
                      `${language === 'ptBR' ? 'pass-Pt' : 'pass-En'}`,
                    ) ||
                    getErrorMessageByFieldName(
                      `${language === 'ptBR' ? 'pass-num-Pt' : 'pass-num-En'}`,
                    ) ||
                    getErrorMessageByFieldName(
                      `${language === 'ptBR' ? 'pass-car-Pt' : 'pass-car-En'}`,
                    ) ||
                    getErrorMessageByFieldName(
                      `${language === 'ptBR' ? 'pass-let-Pt' : 'pass-let-En'}`,
                    )
                  }
                  label={t('input-pass')}
                  id="passwaord"
                  value={password}
                  width="100%"
                  maxLength={12}
                  minLength={6}
                  onChange={handlePasswordInputChange}
                />
              </FormGroup>
            </BoxGrid>
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

      {!!(
        queryOffice.isLoading ||
        queryProfile.isLoading ||
        queryShift.isFetching
      ) && <CircularProgressPortal />}
    </>
  );
}
