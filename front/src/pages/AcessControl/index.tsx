import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { ButtonMain } from '../../components/Button/ButtonMain';
import { ModalConfirm } from '../../components/Modal/ModalConfirm';
import { TableAccess } from '../../components/Tables/TableAcess';
import {
  IControlProfile,
  IProfileEdit,
} from '../../interfaces/IControlProfile';
import { fetchAccess } from '../../services/GlobalServices/acessCrontolServices';
import Api from '../../services/Api';
import { ActionsButton, Container } from '../../styles/global';

export function AccessControl() {
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [editProfiles, setEditProfiles] = useState<IProfileEdit[]>([]);
  const [edit, setEdit] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const { t } = useTranslation();

  const { data, isLoading } = useQuery(['Access'], () => fetchAccess(), {
    onSuccess: (dataOnSuccess) => {
      setEditProfiles(
        dataOnSuccess.map((item) => ({
          profile_id: item?.profile_id,
          transaction_ids: item?.transactions.map(
            (transactions) => transactions?.transaction_id,
          ),
        })),
      );
    },
    keepPreviousData: false,
  });

  useEffect(() => {
    setProfiles(
      data?.filter((profile: IControlProfile) => profile?.profile_id !== 1),
    );
  }, [data]);

  function handleChangeCheck(
    event: ChangeEvent<HTMLInputElement>,
    profileControl: IControlProfile,
  ) {
    setEdit(true);
    const transaction_id = event.target.getAttribute('data-transaction');
    if (event.target.checked) {
      editProfiles.map((profile) => {
        if (profile?.profile_id === profileControl?.profile_id) {
          profile.transaction_ids.push(Number(transaction_id));
        }
      });
    } else {
      editProfiles.map((profile) => {
        if (profile?.profile_id === profileControl?.profile_id) {
          const withoutTransactions = profile.transaction_ids.filter(
            (transaction) => transaction !== Number(transaction_id),
          );
          const withoutProfile = editProfiles?.filter(
            (profile) => profile?.profile_id !== profileControl?.profile_id,
          );
          withoutProfile.push({
            profile_id: profile.profile_id,
            transaction_ids: withoutTransactions,
          });
          setEditProfiles(withoutProfile);
        }
      });
    }
  }

  function onSaveFields() {
    const body = {
      profiles: editProfiles.filter((profile) => profile?.profile_id !== 1),
    };

    Api.put('access-control/profiles', body)

      .then(() => {
        toast.success(`${t('toast-access-control-update')}`);
        setEdit(false);
      })
      .catch(() => toast.error(`${t('toast-access-control-error')}`));
  }

  function handleCloseModal() {
    refreshPage();
    setIsModalConfirmOpen(false);
  }

  function refreshPage() {
    window.location.reload();
  }

  return (
    <>
      <BreadCrumbs />
      <Container>
        <ModalConfirm
          isModalActive={isModalConfirmOpen}
          handleCancel={() => setIsModalConfirmOpen(false)}
          handleClose={handleCloseModal}
        />
        <h1>{t('access-control')}</h1>

        <TableAccess
          id="table"
          data={profiles}
          onChangeCheck={handleChangeCheck}
          loading={isLoading}
        />

        <ActionsButton>
          <ButtonMain
            secondaryStyle
            label={t('button-cancel')}
            type="button"
            onClick={() => setIsModalConfirmOpen(true)}
            disabled={!edit}
          />
          <ButtonMain
            label={t('button-save')}
            onClick={onSaveFields}
            disabled={!edit}
          />
        </ActionsButton>
      </Container>
    </>
  );
}
