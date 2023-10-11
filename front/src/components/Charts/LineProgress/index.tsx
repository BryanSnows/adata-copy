import { ContainerLine } from './styles';
import { ILine } from './types';

export function LinePress({ percentage, height, id, total }: ILine) {
  return (
    <ContainerLine percentage={percentage} height={height}>
      <div className="progress">
        <div className="progress-bar"></div>
        <p>{total}</p>
      </div>
    </ContainerLine>
  );
}
