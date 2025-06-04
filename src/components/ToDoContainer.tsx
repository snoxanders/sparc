'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import TaskForm, { IFormInputs } from './TaskForm';

interface IFormInputsWithId extends IFormInputs {
  id: number;
}

export default function ToDoContainer(){
  const [tasks, setTasks] = useState<IFormInputsWithId[]>([]);
  const [editingTask, setEditingTask] = useState<IFormInputsWithId | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const handleEdit = (task: IFormInputsWithId) => {
    setEditingTask(task);
    setOpen(true);
  };

  const handleFormSubmit = (data: IFormInputs) => {
    const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    if (editingTask) {
      const updatedTasks = existingTasks.map((task: IFormInputsWithId) =>
        task.id === editingTask.id ? { ...task, ...data, id: editingTask.id } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setEditingTask(null);
    } else {
      const newTask = { id: Date.now(), ...data };
      const updatedTasks = [...existingTasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    }

    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: 'taskName', headerName: 'Activity Name', flex: 1 },
    {
      field: 'importance',
      headerName: 'Importance',
      flex: 1,
      renderCell: ({ value }) => {
        let bgColor = '';
        if (value === 'high') bgColor = '#f44336';
        else if (value === 'mid') bgColor = '#ff9800';
        else if (value === 'low') bgColor = '#4caf50';

        return (
          <div
            style={{
              padding: '4px 8px',
              color: '#fff',
              opacity: 0.7,
              backgroundColor: bgColor,
              textTransform: 'capitalize',
              fontWeight: 600,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Due Date',
      flex: 1,
      renderCell: ({ value }) => {
        const date = new Date(value);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
      },
    },
    {
      field: 'sendReminders',
      headerName: 'Reminders',
      flex: 1,
      renderCell: ({ value }) => (value ? 'Yes' : 'No'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <Box
        sx={{
          backgroundColor: '#fff',
          flexDirection: 'column',
          maxWidth: '1200px',
          width: '1200px',
          height: '80vh',
          padding: '2rem',
          borderRadius: '1rem',
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ mb: 2 }}
        >
          Add task
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add a New Task'}</DialogTitle>
          <DialogContent>
            <TaskForm onSubmit={handleFormSubmit} defaultValues={editingTask || undefined} />
          </DialogContent>
        </Dialog>

        <div style={{ height: '60vh', width: '100%' }}>
          <DataGrid
            rows={tasks}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      </Box>
    </div>
  );
}
