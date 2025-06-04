'use client';
import React from 'react';
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export interface IFormInputs {
  taskName: string;
  importance: 'high' | 'mid' | 'low';
  date: Date;
  sendReminders: boolean;
}

const schema = yup
  .object({
    taskName: yup.string().required('Task name is required'),
    importance: yup
      .mixed<'high' | 'mid' | 'low'>()
      .oneOf(['high', 'mid', 'low'])
      .required('Importance is required'),
    date: yup.date().required('Date is required'),
    sendReminders: yup.boolean().default(false),
  })
  .required();

interface TaskFormProps {
  onSubmit: SubmitHandler<IFormInputs>;
  defaultValues?: IFormInputs;
}

export default function TaskForm({ onSubmit, defaultValues }: TaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      taskName: '',
      importance: 'mid',
      date: new Date(),
      sendReminders: false,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="taskName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Task Name"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.taskName}
              helperText={errors.taskName?.message}
            />
          )}
        />

        <Controller
          name="importance"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Importance"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.importance}
              helperText={errors.importance?.message}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="mid">Mid</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Task Date"
              value={field.value}
              onChange={(date) => field.onChange(date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: !!errors.date,
                  helperText: errors.date?.message,
                },
              }}
            />
          )}
        />

        <Controller
          name="sendReminders"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Send reminders"
            />
          )}
        />

        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </LocalizationProvider>
  );
}
