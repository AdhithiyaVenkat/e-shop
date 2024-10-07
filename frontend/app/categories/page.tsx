'use client';

import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import api from '@/utils/api'; // Assuming API utility is configured for API calls
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className="p-6">
      <Typography variant="h4" className="mb-6 text-center">Categories</Typography>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
            <Card className="shadow-lg" onClick={() => router.push(`/products?categoryId=${category._id}`)}>
              <CardContent>
                <Typography variant="h6" className="text-gray-800">
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoriesPage;
