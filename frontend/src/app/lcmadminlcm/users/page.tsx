'use client'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useRouter } from "next/navigation";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Box, Button, Card, CardActions, CardContent, FormControl, Grid, Input, InputLabel, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Pagination, Paper, Select, TextField, Tooltip, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { orderStatus } from "@/common/const/orders/statusOrders.const";
import { getCookieToken } from '@/common/utils/getCookieToken';
import { config } from '@/common/configs/config';
import { useState } from 'react';
export default function UsersAdmin(props: any) {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    userName: '',
    password: '',
    role: '',
    store: '',
  })
  const submit = (e: any) => {
    e.preventDefault()
    fetch(`${config.backend}/users/createUserStaff`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
      body: JSON.stringify(
        {
          "fullName": form.userName,
          "email": form.email,
          "telphone": "string",
          "DNI": "string",
          "bornAt": "2024-07-26T21:50:06.363Z",
          "gender": "string",
          "password": form.password,
          "hashPassword": "string",
          "role": form.role,
          "store": form.store,
        }
      )
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) {
        alert('agregado con exito')
      } else {
        alert(data.error)
      }
    })
  }
  return (<Grid container spacing={3}>
    <Grid xs={3} item className="hidden sm:block">
      <Paper elevation={3} className="min-h-screen h-full ">
        <List>
          <ListItem>

          </ListItem>
          <Tooltip title="Ordenes del dia, son las ordenes que tienen que ser procesadas el dia de hoy">
            <ListItem disablePadding onClick={() => {
              router.push('/lcmadminlcm')
            }}>
              <ListItemButton >
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText primary="Tomas rápidas " />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      </Paper>

    </Grid>
    <Grid xs={9} item>
      <div className="p-5 sm:pt-5 sm:pr-5 sm:pb-5  ">
        <Grid container spacing={5} justifyContent="center">
          <Grid xs={4} item container >
            <form className='w-full' onSubmit={submit}>

              <Grid xs={12} item>
                <Input className="my-1" type='email' placeholder='correo de usuario'
                  onChange={(e) => { setForm({ ...form, email: e.target.value }) }} fullWidth />
              </Grid>
              <Grid xs={12} item>
                <Input
                  className="my-1"
                  type='text'
                  placeholder='Nombre de usuario'
                  onChange={(e) => { setForm({ ...form, userName: e.target.value }) }} fullWidth />
              </Grid>
              <Grid xs={12} item>
                <Input
                  className="my-1"
                  type='password'
                  placeholder='contraseña'
                  fullWidth
                  onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                />
              </Grid>

              <FormControl className="my-1" fullWidth>
                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                <Select
                  value={form.role}
                  label="Age"
                  onChange={(e) => { setForm({ ...form, role: e.target.value }) }}
                >
                  <MenuItem value="admin">admin</MenuItem>
                  <MenuItem value="flebotomista">flebotomista</MenuItem>
                </Select>
              </FormControl>
              <FormControl className="my-1" fullWidth>
                <InputLabel id="demo-simple-select-label">Tienda</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={form.store}
                  label="Age"
                  onChange={(e) => { setForm({ ...form, store: e.target.value }) }}
                >
                  <MenuItem value="la granja">la granja</MenuItem>
                  <MenuItem value="tepeyac">tepeyac</MenuItem>
                  <MenuItem value="aeroplaza">aeroplaza</MenuItem>
                </Select>
              </FormControl>
              <Button variant='contained' type='submit'>Crear</Button>
            </form>
          </Grid>
          <Grid xs={6} item>
            <Grid xs={12}>
              <Card >
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Word of the Day
                  </Typography>
                  <Typography variant="h5" component="div">
                    be*nev*o*lent
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                  </Typography>
                  <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Editar</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  </Grid>)
}