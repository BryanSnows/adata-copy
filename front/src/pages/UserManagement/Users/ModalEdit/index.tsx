import { ModalProps } from '../../../Login/ModalFirstPassword/types';
import ReactDOM from 'react-dom';
import { ModalConfirm } from '../../../../components/Modal/ModalConfirm';
import { DefaultInput } from '../../../../components/Input/DefaultInput';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useErrors } from '../../../../context/hooks/useErrors';
import { ButtonMain } from '../../../../components/Button/ButtonMain';
import { useQuery } from 'react-query';
import { FormGroup } from '../../../../components/FormGroup';
import Api from '../../../../services/Api';
import { toast } from 'react-toastify';
import { BoxGrid, BoxName } from '../NewUser/style';
import { Select } from '../../../../components/Input/Select';
import { ActionsButton, Form, Wrapper } from '../../../../styles/global';
import { formatToOnlyLetters } from '../../../../utils/formatToOnlyLetters';
import { formatToOnlyNumbers } from '../../../../utils/formatToOnlyNumber';
import { Overlay } from '../../../../styles/litlemodal';
import { CircularProgressPortal } from '../../../../components/Loader/CircularProgressPortal';
import { useTranslation } from 'react-i18next';
import {
  fetchOffice,
  fetchProfile,
  fetchShift,
  getUser,
} from '../../../../services/GlobalServices/userServices';

export function ModalEditUser({
  isModalActive,
  closeModal,
  keyId,
}: ModalProps) {
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [profile, setProfile] = useState<any>();
  const [office, setOffice] = useState<any>();
  const [shift, setShift] = useState<any>();
  const [userName, setUserName] = useState('');
  const [mesID, setMesID] = useState('');
  const [userEnrollment, setUserEnrollment] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState<number | undefined>(0);
  const { t } = useTranslation();

  const modalRoot = document.getElementById('modal') as HTMLElement;

  const { errors, setError, removeError, getErrorMessageByFieldName } =
    useErrors();

  const queryProfile = useQuery(['PROFILE'], () => fetchProfile());

  const queryOffice = useQuery(['OFFICE'], () => fetchOffice());

  const queryShift = useQuery(['SHIFT'], () => fetchShift());

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['keyId', id],
    () => getUser(id),
    {
      onSuccess: (dataOnSuccess) => {
        setUserName(dataOnSuccess?.user_name);
        setUserEnrollment(dataOnSuccess?.user_enrollment);
        setProfile({
          id: dataOnSuccess?.profile?.profile_id,
          value: dataOnSuccess?.profile?.profile_name,
        });
        setOffice({
          id: dataOnSuccess?.office?.office_id,
          value: dataOnSuccess?.office?.oficce_name,
        });
        setShift({
          id: dataOnSuccess?.shift?.shift_id,
          value: dataOnSuccess?.shift?.shift_name,
        });
        setEmail(dataOnSuccess?.user_email);
        setMesID(dataOnSuccess?.user_mes_id);
      },

      keepPreviousData: false,
    },
  );

  useEffect(() => {
    setId(keyId);
  }, [id, keyId]);

  const isFormValid =
    errors.length === 0 &&
    (userName !== data?.user_name ||
      userEnrollment !== data?.user_enrollment ||
      profile?.id !== data?.profile?.profile_id ||
      office?.id !== data?.office?.office_id ||
      shift?.id !== data?.shift?.shift_id ||
      email !== data?.user_email ||
      mesID !== data?.user_mes_id);

  function handleUserInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyLetters(event.target.value.trimStart());
    setUserName(value);

    if (!event.target.value || value.trim().length < 4) {
      setError({
        field: 'user-name',
        message: `${t('validation-4-40-l')}`,
      });
    } else {
      removeError('user-name');
    }
  }

  function handleEnrollmentInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(event.target.value);

    setUserEnrollment(value);

    if (!value || value.trim().length < 6) {
      setError({
        field: 'enrollment',
        message: `${t('validation-6-8-n')}`,
      });
    } else {
      removeError('enrollment');
    }
  }

  function handleMesInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = formatToOnlyNumbers(event.target.value);
    setMesID(value);

    if (!value || value.trim().length < 2) {
      setError({
        field: 'mes',
        message: `${t('validation-2-8-n')}`,
      });
    } else {
      removeError('mes');
    }
  }

  function handleProfileInputChange(value: any) {
    setProfile(value);

    if (!value) {
      setError({ field: 'profile', message: `${t('validation-select')}` });
    } else {
      removeError('profile');
    }
  }

  function handleOfficeInputChange(value: any) {
    setOffice(value);

    if (!value) {
      setError({ field: 'office', message: `${t('validation-select')}` });
    } else {
      removeError('office');
    }
  }

  function handleShiftInputChange(value: any) {
    setShift(value);

    if (!value) {
      setError({ field: 'shift', message: `${t('validation-select')}` });
    } else {
      removeError('shift');
    }
  }

  function handleEmailInputChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value.trim());

    const regex_email =
      /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;

    if (!regex_email.test(event.target.value.trim())) {
      setError({ field: 'email', message: `${t('validation-email')}` });
    } else {
      removeError('email');
    }
    if (!event.target.value) {
      removeError('email');
    }
  }

  function handleCancelModal() {
    setIsModalConfirmOpen(false);
  }

  function handleCloseModal() {
    refetch();
    closeModal();
    setIsModalConfirmOpen(false);
    removeError('user-name');
    removeError('enrollment');
    removeError('profile');
    removeError('shift');
    removeError('office');
    removeError('email');
    removeError('mes');
  }

  async function onEditUser() {
    const payload = {
      user_name: userName,
      office_id: office?.id,
      user_enrollment: userEnrollment,
      user_profile_id: profile?.id,
      user_shift_id: shift?.id,
      user_email: email,
      user_mes_id: mesID,
    };

    await Api.put(`user/${keyId}`, payload)
      .then(async () => {
        toast.success(t('user-toast-edit'), {
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
    await onEditUser();
    handleCloseModal();
    refetch();
  }

  if (!isModalActive) {
    return null;
  }

  if (
    !data ||
    isFetching ||
    isLoading ||
    queryOffice?.isLoading ||
    queryProfile?.isLoading ||
    queryShift?.isLoading
  ) {
    return <CircularProgressPortal />;
  }

  return ReactDOM.createPortal(
    <Overlay>
      <ModalConfirm
        isModalActive={isModalConfirmOpen}
        handleCancel={handleCancelModal}
        handleClose={handleCloseModal}
      />
      <Wrapper>
        <h1 style={{ textAlign: 'center', paddingBottom: '2rem' }}>
          {t('user-edit')}
        </h1>
        <Form onSubmit={handleSubmit} noValidate autoComplete="off">
          <BoxName>
            <FormGroup
              error={getErrorMessageByFieldName('user-name')}
              extraErrorMessage={['']}
            >
              <DefaultInput
                error={getErrorMessageByFieldName('user-name')}
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
              error={getErrorMessageByFieldName('enrollment')}
              extraErrorMessage={['']}
            >
              <DefaultInput
                error={getErrorMessageByFieldName('enrollment')}
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
              error={getErrorMessageByFieldName('profile')}
              extraErrorMessage={['']}
            >
              <Select
                error={getErrorMessageByFieldName('profile') ? true : false}
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
              error={getErrorMessageByFieldName('mes')}
              extraErrorMessage={['']}
            >
              <DefaultInput
                error={getErrorMessageByFieldName('mes')}
                label={t('input-mes')}
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
              error={getErrorMessageByFieldName('office')}
              extraErrorMessage={['']}
            >
              <Select
                error={getErrorMessageByFieldName('office') ? true : false}
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
              error={getErrorMessageByFieldName('shift')}
              extraErrorMessage={['']}
            >
              <Select
                error={getErrorMessageByFieldName('shift') ? true : false}
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
          <FormGroup
            error={getErrorMessageByFieldName('email')}
            extraErrorMessage={['']}
          >
            <DefaultInput
              error={getErrorMessageByFieldName('email')}
              label={t('input-email')}
              id="email"
              value={email}
              width="100%"
              onChange={handleEmailInputChange}
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
    </Overlay>,
    modalRoot,
  );
}
