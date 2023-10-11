import Drawer from '@mui/material/Drawer';
import { Actions, Close, Content, Divider, Header, Hour } from './styles';
import { useEffect, useState } from 'react';
import { IFilter, ISituation } from './types';
import { useQuery } from 'react-query';
import { TravelCardSituation } from './services';
import { ButtonMain } from '../../../components/Button/ButtonMain';
import { formatDateAndTime } from '../../../utils/formatParams/formatDateAndTime';
import { useTranslation } from 'react-i18next';

export default function ModalDetails({
  isCommentDrawerActive,
  toggleCommentDrawer,
  travelCardSerial,
  cont,
}: ISituation) {
  const [serial, setSerial] = useState<number | undefined>(0);
  const [filter, setFilter] = useState([]);
  const [time, setTime] = useState<number | undefined>(0);
  const [sitOne, setSitOne] = useState<string | undefined>('');
  const [siTwo, setSitTwo] = useState<string | undefined>('');
  const [sitTree, setSitTree] = useState<string | undefined>('');
  const [sitFor, setSitFor] = useState<string | undefined>('');
  const { t } = useTranslation();

  useEffect(() => {
    setSerial(travelCardSerial);
  }, [serial, travelCardSerial]);

  useEffect(() => {
    setTime(cont);
  }, [time, cont]);

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['keyId', travelCardSerial, cont],
    () => TravelCardSituation(travelCardSerial),
    {
      onSuccess: (dataOnSuccess) => {
        setFilter(
          dataOnSuccess?.filter(
            (item: IFilter) => item?.test_serial_count === time,
          ),
        );
      },

      keepPreviousData: false,
    },
  );

  return (
    <Drawer anchor={'right'} open={isCommentDrawerActive} role="presentation">
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

        <Divider />
        <Hour>
          <h5>{t('travel-input-cell')}</h5>
          <h3>
            {filter?.map((item) =>
              item?.situation_id === 1
                ? formatDateAndTime(item?.created_at)
                : '',
            )}
          </h3>
        </Hour>
        <Divider />
        <Hour>
          <h5>{t('travel-input-mst')}</h5>
          <h3>
            {filter?.map((item) =>
              item?.situation_id === 3 ? item?.mst?.mst_name : '',
            )}
          </h3>
          <h3>
            {filter?.map((item) =>
              item?.situation_id === 2
                ? formatDateAndTime(item?.created_at)
                : '',
            )}
          </h3>
        </Hour>
        <Divider />
        <Hour>
          <h5>{t('travel-output-mst')}</h5>
          <h3>
            {filter?.map((item) =>
              item?.situation_id === 3 ? item?.mst?.mst_name : '',
            )}
          </h3>
          <h3>
            {filter?.map((item) =>
              item?.situation_id === 3
                ? formatDateAndTime(item?.created_at)
                : '',
            )}
          </h3>
        </Hour>
        <Divider />
        <Hour>
          <h5>{t('travel-output-cell')}</h5>
          <h3>
            {filter?.map((item) =>
              item?.situation_id === 4
                ? formatDateAndTime(item?.created_at)
                : '',
            )}
          </h3>
        </Hour>
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
