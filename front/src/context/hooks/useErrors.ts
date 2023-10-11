import { useState } from 'react';

interface IErrors {
  field: string;
  message: string;
}

export function useErrors() {
  const [errors, setErrors] = useState<Array<IErrors>>([]);

  function setError({ field, message }: IErrors) {
    const errorAlreadyExists = errors.find(
      (error: IErrors) => error.field === field,
    );

    if (errorAlreadyExists) {
      return;
    }

    setErrors((prevState: Array<IErrors>) => [
      ...prevState,
      { field, message },
    ]);
  }

  function removeError(fieldName: string) {
    setErrors((prevState: Array<IErrors>) =>
      prevState.filter((error) => error.field !== fieldName),
    );
  }

  function getErrorMessageByFieldName(fieldName: string) {
    return errors.find((error: IErrors) => error.field === fieldName)?.message;
  }

  return {
    errors,
    setError,
    removeError,
    getErrorMessageByFieldName,
  };
}
