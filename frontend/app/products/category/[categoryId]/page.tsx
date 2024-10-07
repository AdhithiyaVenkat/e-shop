'use client';

import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Modal, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '@/utils/api';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string; // Include description in product interface
}

const CategoryProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null); // State to track current product (edit mode)
  const [productName, setProductName] = useState(''); // Form input state for product name
  const [productPrice, setProductPrice] = useState(''); // Form input state for product price
  const [productStock, setProductStock] = useState(''); // Form input state for product stock
  const [productDescription, setProductDescription] = useState(''); // Form input state for product description
  const { categoryId } = useParams(); // Extract categoryId from URL params
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        try {
          const { data } = await api.get(`/products/category/${categoryId}`);
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };
    fetchProducts();
  }, [categoryId]);

  // Function to handle opening the modal (for adding new product or editing an existing one)
  const handleOpenModal = (product: Product | null) => {
    if (product) {
      setCurrentProduct(product); // Edit mode
      setProductName(product.name);
      setProductPrice(product.price.toString());
      setProductStock(product.stock.toString());
      setProductDescription(product.description); // Set description
    } else {
      setCurrentProduct(null); // Add new product
      setProductName('');
      setProductPrice('');
      setProductStock('');
      setProductDescription(''); // Reset description
    }
    setModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Function to handle form submission (add or edit)
  const handleSubmit = async () => {
    try {
      if (currentProduct) {
        // Edit product logic
        await api.put(`/products/${currentProduct._id}`, {
          name: productName,
          price: parseFloat(productPrice),
          stock: parseInt(productStock),
          description: productDescription, // Include description in the update request,
          category: categoryId
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Add new product logic
        await api.post('/products', {
          name: productName,
          price: parseFloat(productPrice),
          stock: parseInt(productStock),
          description: productDescription, // Include description in the create request
          category: categoryId,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Refresh products data after submitting
      const { data } = await api.get(`/products/category/${categoryId}`);
      setProducts(data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6">Products in Category</Typography>
      <Button variant="contained" onClick={() => handleOpenModal(null)}>
        Create New Product
      </Button>

      {!products.length ? (
        <span className='flex justify-center w-full'>
          No records found
        </span>
      ) : (
        <TableContainer component={Paper} className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(product)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for adding or editing products */}
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
            {currentProduct ? 'Edit Product' : 'Create New Product'}
          </Typography>

          {/* Input field for product name */}
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mb-4"
          />

          {/* Input field for product price */}
          <TextField
            label="Product Price"
            variant="outlined"
            fullWidth
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="mb-4"
            type="number"
          />

          {/* Input field for product stock */}
          <TextField
            label="Product Stock"
            variant="outlined"
            fullWidth
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            className="mb-4"
            type="number"
          />

          {/* Input field for product description */}
          <TextField
            label="Product Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="mb-4"
          />

          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {currentProduct ? 'Save Changes' : 'Create Product'}
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

export default CategoryProducts;
