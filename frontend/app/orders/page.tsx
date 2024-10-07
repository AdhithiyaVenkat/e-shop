'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import api from '@/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {token} = useSelector((state: RootState) => state.auth);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">
        Your Orders
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography variant="h6">No orders found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item key={order._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Order ID: {order.orderId}</Typography>
                  <Typography variant="body2">Total: ₹{order.totalPrice}</Typography>
                  {order.orderItems.map((item) => (
                    <Typography key={item.product} variant="body2">
                      {item.name} - {item.quantity} x ₹{item.price}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default OrdersPage;
