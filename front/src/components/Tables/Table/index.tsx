import { forwardRef } from 'react';
import { organizeData } from './utils/organizedData';
import {
  Actions,
  ContainerWrapper,
  Empty,
  Progress,
  TableBox,
  Wrapper,
} from './styles';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { TableProps } from './types';
import { ReactComponent as Reset } from '../../../assets/icons/reset.svg';
import { ReactComponent as EmptyTableImg } from '../../../assets/images/empty-data.svg';
import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import { ReactComponent as Eye } from '../../../assets/icons/eye.svg';
import { ReactComponent as Tool } from '../../../assets/icons/tool.svg';
import { Switch } from '../../Input/Switch';
import { CircularProgressTable } from '../../Loader/CircularProgressTable';
import { useTranslation } from 'react-i18next';

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      id,
      data,
      headers,
      enableActions,
      checkBox,
      emptyMessage,
      instruction,
      loading,
      otherColor,
      textColor,
      checkState,
      onCheckAll,
      onCheck,
      onChangeStatus,
      onResetPassword,
      onEdit,
      onDetail,
      onRepair,
      checkStateAll,
    },
    ref,
  ) => {
    const [organizedData, indexedHeader] = organizeData(data, headers);
    const { t } = useTranslation();

    return (
      <>
        {data?.length !== 0 && (
          <Wrapper>
            <ContainerWrapper>
              <TableBox ref={ref} id={id}>
                <thead>
                  <tr>
                    {checkBox && (
                      <th key={'all'} style={{ textAlign: 'left' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="success"
                              sx={{
                                color: '#ffffff',
                              }}
                              disableRipple
                              onClick={() => onCheckAll && onCheckAll()}
                              checked={checkStateAll}
                            />
                          }
                          label={
                            <Typography
                              style={{
                                fontWeight: 'bold',
                                color: '#ffffff',
                              }}
                            >
                              {t('all')}
                            </Typography>
                          }
                        />
                      </th>
                    )}

                    {headers?.map((header) => (
                      <th
                        key={header.key}
                        style={{
                          paddingLeft: headers.length === 1 ? '3rem' : '',
                          width: header.columnWidth ? header.columnWidth : '',
                          textAlign: header.leftHeader ? 'left' : 'center',
                          backgroundColor: otherColor,
                          color: textColor,
                        }}
                      >
                        {header.value}
                      </th>
                    ))}

                    {enableActions && (
                      <th style={{ width: '170px' }} className="center">
                        {t('component-table-actions')}
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {organizedData?.map((row: any, i: number) => (
                    <tr key={i}>
                      {checkBox && (
                        <td key={'all'}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disableRipple
                                color="success"
                                onClick={() =>
                                  onCheck && onCheck(row.$original)
                                }
                                checked={checkState.some(
                                  (item) => item === row.$original.mserial_id,
                                )}
                              />
                            }
                            label={<></>}
                          />
                        </td>
                      )}
                      {Object.keys(row).map((item, index) => {
                        return (
                          item !== '$original' && (
                            <td
                              key={row[item]}
                              style={{
                                paddingLeft: headers.length === 1 ? '3rem' : '',
                                width: indexedHeader[item].columnWidth
                                  ? indexedHeader[item].columnWidth
                                  : '',
                                textAlign: indexedHeader[item].leftBody
                                  ? 'left'
                                  : 'center',
                              }}
                            >
                              {t(`${row[item]}`) || 'N/A'}
                            </td>
                          )
                        );
                      })}

                      {enableActions && (
                        <td>
                          <Actions
                            style={{
                              width: '100%',
                              justifyContent:
                                onDetail || onRepair ? 'center' : 'center',
                              paddingRight: headers.length === 1 ? '1rem' : '',
                            }}
                          >
                            {onEdit && (
                              <button
                                onClick={() => onEdit && onEdit(row.$original)}
                                title={t('component-table-edit')}
                              >
                                <Pencil />
                              </button>
                            )}

                            {onDetail && (
                              <button
                                onClick={() =>
                                  onDetail && onDetail(row.$original)
                                }
                                title={t('component-table-detail')}
                              >
                                <Eye />
                              </button>
                            )}

                            {onRepair && (
                              <button
                                onClick={() =>
                                  onRepair && onRepair(row.$original)
                                }
                                title={t('component-table-repair')}
                              >
                                <Tool />
                              </button>
                            )}

                            {onResetPassword && (
                              <button
                                onClick={() =>
                                  onResetPassword &&
                                  onResetPassword(row.$original)
                                }
                                title={t('component-table-reset')}
                              >
                                <Reset />
                              </button>
                            )}

                            {onChangeStatus && (
                              <Switch
                                checked={
                                  !!row.$original.user_status ||
                                  !!row.$original.shift_status ||
                                  !!row.$original.cabinet_status ||
                                  !!row.$original.office_status ||
                                  !!row.$original.mst_status
                                }
                                onChange={() =>
                                  onChangeStatus &&
                                  onChangeStatus(row.$original)
                                }
                                title={t('component-table-activated')}
                              />
                            )}
                          </Actions>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </TableBox>

              {loading && (
                <Progress>
                  <CircularProgressTable />
                </Progress>
              )}
            </ContainerWrapper>
          </Wrapper>
        )}

        {data?.length === 0 && (
          <Wrapper>
            <TableBox ref={ref} id={id}>
              <thead>
                <tr>
                  <th style={{ background: '#00A7EA', height: '50px' }} />
                </tr>
              </thead>
            </TableBox>
            <Empty>
              <EmptyTableImg />
              <h1> {emptyMessage}</h1>
              <p>{instruction}</p>
            </Empty>
          </Wrapper>
        )}
      </>
    );
  },
);
