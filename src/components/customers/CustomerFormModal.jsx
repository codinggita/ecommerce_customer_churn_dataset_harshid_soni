import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControlLabel, Switch, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';

const validationSchema = Yup.object({
  customerCode: Yup.string().required('Customer Code is required'),
  age: Yup.number().required('Age is required').min(18, 'Must be at least 18'),
  gender: Yup.string().required('Gender is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  lifetimeValue: Yup.number().required('Lifetime Value is required').min(0),
});

export default function CustomerFormModal({ open, onClose, customer, onSave }) {
  const formik = useFormik({
    initialValues: {
      customerCode: '',
      age: '',
      gender: 'Male',
      country: '',
      city: '',
      lifetimeValue: 0,
      churned: false,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (customer) {
      formik.setValues({
        customerCode: customer.customerCode || '',
        age: customer.age || '',
        gender: customer.gender || 'Male',
        country: customer.country || '',
        city: customer.city || '',
        lifetimeValue: customer.lifetimeValue || 0,
        churned: customer.churned || false,
      });
    } else {
      formik.resetForm();
    }
  }, [customer, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers className="space-y-4">
          <TextField
            fullWidth
            id="customerCode"
            name="customerCode"
            label="Customer Code"
            value={formik.values.customerCode}
            onChange={formik.handleChange}
            error={formik.touched.customerCode && Boolean(formik.errors.customerCode)}
            helperText={formik.touched.customerCode && formik.errors.customerCode}
            disabled={!!customer} // Disable code edit if updating
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                id="gender"
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="country"
                name="country"
                label="Country"
                value={formik.values.country}
                onChange={formik.handleChange}
                error={formik.touched.country && Boolean(formik.errors.country)}
                helperText={formik.touched.country && formik.errors.country}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            id="lifetimeValue"
            name="lifetimeValue"
            label="Lifetime Value ($)"
            type="number"
            value={formik.values.lifetimeValue}
            onChange={formik.handleChange}
            error={formik.touched.lifetimeValue && Boolean(formik.errors.lifetimeValue)}
            helperText={formik.touched.lifetimeValue && formik.errors.lifetimeValue}
          />
          <FormControlLabel
            control={
              <Switch
                id="churned"
                name="churned"
                checked={formik.values.churned}
                onChange={formik.handleChange}
                color="error"
              />
            }
            label="Churned Customer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {customer ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
