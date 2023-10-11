import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { BreadCrumbs } from '../../../components/BreadCrumbs';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import {
  ActionsButton,
  Container,
  Form,
  Wrapper,
} from '../../../styles/global';

import { FormGroup } from '../../../components/FormGroup';
import { Select } from '../../../components/Input/Select';
import { useErrors } from '../../../context/hooks/useErrors';
import { getAllCabinet } from '../../../services/GlobalServices/cabinetServices';
import { BoxGrid } from '../../UserManagement/Users/NewUser/style';
import { Switch } from '../../../components/Input/Switch';
import { ChipInpuT } from '../../../components/Input/ChipInput';
import { toast } from 'react-toastify';
import Api from '../../../services/Api';

export function FailureCollection() {
  const [items, setItems] = useState<String[]>([]);
  const [cabinet, setCabinet] = useState<any>();
  const [ErrorCabinet, setErrorCabinet] = useState(false);
  const [fail, setFail] = useState<boolean>(false);
  const { t } = useTranslation();
  const language = localStorage.getItem('language');
  const { getErrorMessageByFieldName } = useErrors();

  const isFormValid = (cabinet && fail) || (cabinet && items?.length > 0);

  const queryCabinets = useQuery(['CABINET'], () => getAllCabinet());

  function handleItemsInputChange(value: any) {
    setItems(value);
  }

  function handleCabinetInputChange(value: any) {
    setCabinet(value);

    if (!value) {
      setErrorCabinet(true);
    } else {
      setErrorCabinet(false);
    }
  }

  async function onSaveFields() {
    const body = {
      defect_serials: items,
    };

    await Api.post(`process/defects-register/${cabinet.value}`, body)
      .then(async (res) => {
        toast.success(t('toast-serial-sucess'));
      })
      .catch((error) => {
        const code = error.response.data.code;
        toast.error(t(`${code}`));
      });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSaveFields();
  }

  return (
    <Container>
      <BreadCrumbs />
      <h1>{t('failure-serials-collection')}</h1>
      <Wrapper>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <BoxGrid>
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                alignContent: 'center',
                padding: 20,
              }}
            >
              <h4 style={{ marginRight: 20 }}>{t('no-flaws')}</h4>
              <Switch
                checked={fail}
                onChange={() => {
                  setFail(!fail);
                }}
              />
            </div>
          </BoxGrid>

          <ChipInpuT
            label={t('serials-collection')}
            id="seriais"
            onChangeValue={handleItemsInputChange}
            maxLength={250}
            disabled={fail}
          />

          <ActionsButton>
            <ButtonMain
              label={t('to-send')}
              type="submit"
              disabled={!isFormValid}
            />
          </ActionsButton>
        </Form>
      </Wrapper>
    </Container>
  );
}
