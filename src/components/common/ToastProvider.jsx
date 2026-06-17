import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';

export default function ToastProvider({ children }) {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.toasts);

  const handleClose = (id) => {
    dispatch(removeToast(id));
  };

  return (
    <>
      {children}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{ bottom: 24 + index * 60 }} // Stack them
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.type || 'info'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
