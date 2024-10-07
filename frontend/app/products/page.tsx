'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Button, IconButton, TextField } from '@mui/material';
import { Add, Remove } from '@mui/icons-material'; // Icons for increment and decrement
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/utils/api';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { useDispatch } from 'react-redux';
import { addToCart } from '@/features/cartSlice';

interface Product {
  _id: string;
  name: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const dispatch = useDispatch(); // Initialize the Redux dispatcher
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products/category/${categoryId}`);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity > 0 ? newQuantity : 1, // Ensure quantity stays above 1
    }));
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p._id === productId); // Get product details
    const quantity = quantities[productId] || 1; // Default to 1 if quantity is not set

    if (product) {
      // Dispatch the addToCart action to Redux
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
        })
      );

      // Show toast notification
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to the cart!`);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className="p-6">
      <ToastContainer /> {/* Add ToastContainer to display notifications */}
      <Typography variant="h4" className="mb-6 text-center">Products</Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card className="shadow-lg">
              <img
                src="/images/dummy-product.png" // Dummy image (place a placeholder image in your public/images folder)
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <CardContent className='space-y-2'>
                <Typography variant="h6" className="text-gray-800">
                  {product.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  ₹{product.price}
                </Typography>

                {/* Quantity Selector */}
                <Box display="flex" justifyContent='center' alignItems="center" mt={2}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(product._id, (quantities[product._id] || 1) - 1)}
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    size="small"
                    value={quantities[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value, 10))}
                    type="number"
                    inputProps={{ min: 1, style: { textAlign: 'center' } }}
                    style={{ width: '80px', margin: '0 10px' }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(product._id, (quantities[product._id] || 1) + 1)}
                  >
                    <Add />
                  </IconButton>
                </Box>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddToCart(product._id)}
                  fullWidth
                  className="mt-4"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
