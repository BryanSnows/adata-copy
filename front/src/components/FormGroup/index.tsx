import { Container } from './styles';

import { FormGroupProps } from './types';

export function FormGroup({
  children,
  error,
  errorPasswordNumber,
  errorPasswordCaracter,
  errorPasswordLet,
  extraErrorMessage,
  isfullwidth,
}: FormGroupProps) {
  return (
    <Container isfullwidth={isfullwidth}>
      {children}
      {error && <small>{error}</small>}
      {errorPasswordNumber && <small>{errorPasswordNumber}</small>}
      {errorPasswordCaracter && <small>{errorPasswordCaracter}</small>}
      {errorPasswordLet && <small>{errorPasswordLet}</small>}
      {error &&
        extraErrorMessage.map((item: string, index: number) => (
          <small key={index}>{item}</small>
        ))}
    </Container>
  );
}
