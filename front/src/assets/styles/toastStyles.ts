import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

export const StyledToast = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    margin-top: 4rem;
  }

  .Toastify__toast-theme--colored.Toastify__toast--error {
    background-color: #ff003d;
    /* content: url('../icons/alert.svg'); */
  }

  .Toastify__toast-theme--colored.Toastify__toast--success {
    background-color: #05a763;
    /* content: url('../icons/check.svg'); */
  }
`;
