'use client';

import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

interface Category {
  _id: string;
  name: string;
  stock_available: number;
  total_sales_amount: number;
}

const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null); // State to track current category (edit mode)
  const [newCategoryName, setNewCategoryName] = useState(''); // Form input state
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Function to handle opening the modal (for new category or editing an existing one)
  const handleOpenModal = (category: Category | null) => {
    if (category) {
      setCurrentCategory(category); // Editing mode
      setNewCategoryName(category.name);
    } else {
      setCurrentCategory(null); // Creating new category
      setNewCategoryName('');
    }
    setModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Function to handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (currentCategory) {
        // Edit category logic
        await api.put(`/categories/${currentCategory._id}`, { name: newCategoryName }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new category logic
        await api.post('/categories', { name: newCategoryName }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Refresh category data after submitting
      const { data } = await api.get('/categories');
      setCategories(data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Function to handle delete category
  const handleDelete = async (categoryId: string) => {
    try {
      await api.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }); // Send DELETE request to API
      // Refresh the categories after deletion
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6">Manage Categories</Typography>
      <Button variant="contained" onClick={() => handleOpenModal(null)}>
        Create New Category
      </Button>

      <TableContainer component={Paper} className="mt-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Stock Available</TableCell>
              <TableCell>Total Sales Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.stock_available}</TableCell>
                <TableCell>₹{category.total_sales_amount}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button variant="contained" onClick={() => router.push(`/products/category/${category._id}`)}>
                    View Products
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for creating or editing categories */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            boxShadow: 24,
            padding: '1.5rem',
            borderRadius: '10px',
          }}
        >
          <Typography variant="h6" className="mb-4">
            {currentCategory ? 'Edit Category' : 'Create New Category'}
          </Typography>

          {/* Input field for category name */}
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="mb-4"
          />

          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {currentCategory ? 'Save Changes' : 'Create Category'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ManageCategories;
