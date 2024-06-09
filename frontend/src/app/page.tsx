import MainLayout from "@/components/layout/MainLayout";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, TextField, Typography } from "@mui/material";
import React from "react";

export default function Home() {
  const CardComponent = (
    <Card>
      <CardMedia
        sx={{ height: 140 }}
        image="https://thumbs.dreamstime.com/b/lacertilia-nature-chameleon-soft-focus-phu-soi-dao-national-park-uttaradit-northern-thailand-lacertilia-nature-99048757.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography variant="h5" component="div">
          Nombre de producto
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          descripción
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained">Agregar al carrito</Button>
      </CardActions>
    </Card>
  );
  return (
    <MainLayout>
      <div className="px-[20%]">
        <section className="mt-4 ">
          <TextField id="search-product" label="Buscar por nombre del producto" variant="outlined" fullWidth />
        </section>
        <section className="mt-4 ">
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} lg={3}>
              {CardComponent}
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              {CardComponent}
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              {CardComponent}
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              {CardComponent}
            </Grid>
          </Grid>
        </section>
      </div>

    </MainLayout>
  );
}
