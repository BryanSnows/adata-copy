import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import {
  Close,
  Content,
  Divider,
  Header,
} from '../../Travel Card/ModalDetails/styles';
import { ISituation } from '../../Travel Card/ModalDetails/types';
import { SnListSerial } from './services';
import { ContainerMST, ContainerStatus, Actions } from './styles';
import Check from '../../../assets/images/checkGrenn.png';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { formatDateAndTime } from '../../../utils/formatParams/formatDateAndTime';
import Reject from '../../../assets/images/rejected.png';

export function Detail({
  isCommentDrawerActive,
  toggleCommentDrawer,
  snlist,
}: ISituation) {
  const { t } = useTranslation();

  const [serial, setSerial] = useState(0);

  useEffect(() => {
    setSerial(snlist);
  }, [snlist]);

  const { data } = useQuery(
    ['keyIdsnlist', serial],
    () => serial && SnListSerial(serial),
  );

  return (
    <Drawer
      anchor={'right'}
      open={isCommentDrawerActive}
      role="presentation"
      onClose={() => toggleCommentDrawer(false)}
    >
      <Content>
        <Close>
          <button
            className="close-icon"
            onClick={() => toggleCommentDrawer(false)}
          >
            &#10006;
          </button>
        </Close>

        <Header>
          <h3>{t('travel-visualization')}</h3>
          <h1>{serial}</h1>
        </Header>

        <ContainerStatus>
          {data && (
            <>
              <h4>
                WO:
                <p>{data[0]?.work_order_number}</p>
              </h4>
              <h4>
                {`${t('model')}`}:<p>{data[0]?.model_name}</p>
              </h4>
              <h4>
                {`${t('radial-client')}`}:<p>{data[0]?.customer}</p>
              </h4>
            </>
          )}
        </ContainerStatus>

        <Divider />

        {data &&
          data.map((item) => (
            <>
              <ContainerMST>
                <h3>{item.mst_name}</h3>
                <strong>{formatDateAndTime(item?.created_at)}</strong>
                <h3 className="cabine">{`${item.cabinet_name}`}</h3>
                <strong>{`${t('component-table-position')} ${
                  item.position
                }`}</strong>
                <div className="status">
                  <img
                    src={item.status ? Check : Reject}
                    alt="status"
                    width={27}
                  />
                  <div className="details">
                    <small>Status</small>
                    <h4>{`${
                      item.status ? t('approved') : t('disapproved')
                    }`}</h4>
                  </div>
                </div>
              </ContainerMST>
              <Divider />
            </>
          ))}

        <Actions>
          <ButtonMain
            width="130px"
            secondaryStyle
            label={t('button-close')}
            onClick={() => toggleCommentDrawer(false)}
          />
        </Actions>
      </Content>
    </Drawer>
  );
}
