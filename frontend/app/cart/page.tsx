'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { removeFromCart, clearCart } from '../../features/cartSlice';
import { useRouter } from 'next/navigation';
import { Button, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios'; // Import axios
import { toast, ToastContainer } from 'react-toastify'; // Assuming you are using toast for notifications
import api from '@/utils/api';

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart({ id }));
  };

  const handleCheckout = async () => {
    try {
      // Prepare the order data
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: total,
      };

      // Make the POST request to place the order
      const response = await api.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        // Order placed successfully, clear the cart and navigate to orders page
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        router.push('/orders');
      } else {
        toast.error('Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing the order:', error);
      toast.error('There was an error placing your order.', error?.message);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer /> {/* Add ToastContainer to display notifications */}
      <Typography variant="h4" className="mb-4">
        Your Cart
      </Typography>
      {items.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{item.name}</Typography>
                  <Typography>Price: ₹{item.price}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="mt-4"
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {items.length > 0 && (
        <div className="mt-8">
          <Typography variant="h6">Total: ₹{total}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            className="mt-4"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
