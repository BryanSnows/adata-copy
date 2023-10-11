import { forwardRef } from 'react';
import { organizeData } from '../Table/utils/organizedData';
import { Progress, TableBox, Wrapper } from './styles';
import { CheckBox } from '../../CheckBox';
import { ITableHeader, TableProps } from './types';
import { CircularProgressTable } from '../../Loader/CircularProgressTable';
import { ITransaction } from '../../../interfaces/IControlProfile';
import { useTranslation } from 'react-i18next';

export const TableAccess = forwardRef<HTMLTableElement, TableProps>(
  ({ id, data, loading, onChangeCheck }, ref) => {
    const headers: ITableHeader[] = [{ key: 'profile_name', value: 'Perfil' }];

    const [organizedData] = organizeData(data, headers);
    const { t } = useTranslation();

    return (
      <>
        <Wrapper>
          <TableBox ref={ref} id={id}>
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {t('user-profile')}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {'Dashboard'}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {'Travel Card'}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>{t('fpy')}</th>
                <th style={{ width: '8%', textAlign: 'center' }}>
                  {t('productivity')}
                </th>
                <th style={{ width: '7%', textAlign: 'center' }}>
                  {t('occupation')}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {'SN List'}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {t('records')}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {t('slots')}
                </th>
                <th style={{ width: '5%', textAlign: 'center' }}>
                  {t('serials')}
                </th>
              </tr>
            </thead>

            <tbody>
              {organizedData?.map((row: any, i: number) => (
                <tr key={i}>
                  {Object.keys(row).map((item, index) => {
                    return (
                      item !== '$original' && (
                        <td key={index}>{t(`${row[item]}`) || 'N/A'}</td>
                      )
                    );
                  })}

                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={3}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 200,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={4}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 300,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={5}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 400,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={6}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 500,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={7}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 600,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={8}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 700,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={1}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 100,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={10}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 800,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {onChangeCheck && (
                      <CheckBox
                        transactionNumber={11}
                        isChecked={row.$original.transactions.some(
                          (item: ITransaction) =>
                            item?.transaction_number === 900,
                        )}
                        onChange={(event) =>
                          onChangeCheck && onChangeCheck(event, row.$original)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableBox>

          {loading && (
            <Progress>
              <CircularProgressTable />
            </Progress>
          )}
        </Wrapper>
      </>
    );
  },
);
