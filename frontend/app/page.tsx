'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CategoriesPage from './categories/page';

interface SalesData {
  totalProductsSold: number;
  totalSalesAmount: number;
}

const HomePage: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const role = user?.role;
  const router = useRouter();

  useEffect(() => {
    if (role === 'store_owner') {
        const fetchSalesData = async () => {
          try {
            const { data } = await api.get('/storeowner/sales_data', {
              headers: { Authorization: `Bearer ${token}` },
            });
            setSalesData(data);
          } catch (error) {
            console.error(error);
          }
          
        };
        fetchSalesData();
    }
  }, [role]);

  return (
    <>
    <Box className="p-6">
      {role === 'store_owner' ? (
        <>
          <Typography variant="h4" className="mb-6 text-center">
            Store Owner Dashboard
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-lg">
                <CardContent>
                  <Typography variant="h5" className="text-center">Total Products Sold</Typography>
                  <Typography variant="h4" className="text-center">{salesData?.totalProductsSold || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-lg">
                <CardContent>
                  <Typography variant="h5" className="text-center">Total Sales Amount</Typography>
                  <Typography variant="h4" className="text-center">₹{salesData?.totalSalesAmount || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className="shadow-lg" onClick={() => router.push('/categories/manage')}>
                <CardContent>
                  <Typography variant="h5" className="text-center cursor-pointer">Manage Categories</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
        <CategoriesPage />
        </>
      )}
    </Box>
    </>
  );
};

export default HomePage;
