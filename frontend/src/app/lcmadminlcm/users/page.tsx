'use client'
import { useRouter } from "next/navigation";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Button, Card, CardActions, CardContent, FormControl, Grid, Input, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, Tooltip, Typography } from "@mui/material";
import { getCookieToken } from '@/common/utils/getCookieToken';
import { config } from '@/common/configs/config';
import { useEffect, useState } from 'react';
import { IUsers } from '@/common/interface/users/user.interface';
export default function UsersAdmin(props: any) {
  const router = useRouter()
  const [update, setupdate] = useState(false)
  const [form, setForm] = useState({
    email: '',
    userName: '',
    password: '',
    role: '',
    store: '',
  })
  const [users, setUsers] = useState<IUsers[]>([{
    __v: 0,
    _id: '',
    bornAt: '',
    DNI: '',
    email: '',
    fullName: '',
    gender: '',
    password: '',
    role: '',
    store: '',
    telphone: '',
    yearBorn: 1900,
  }])
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
  const submitUpdate = (e: any) => {
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
  const handleGetUser = () => {
    fetch(`${config.backend}/users/readStaff`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${getCookieToken()}`,
      },
    }).then(data => data.json()).then(data => {
      if (data.statusCode === 200) setUsers(data.data)
    })
  }
  useEffect(() => {
    handleGetUser()
    return () => {
    }
  }, [])

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
            <form className='w-full' onSubmit={update ? submitUpdate : submit}>

              <Grid xs={12} item>
                <Input className="my-1" type='email' placeholder='correo de usuario'
                  disabled={update}
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }) }} fullWidth />
              </Grid>
              <Grid xs={12} item>
                <Input
                  disabled={update}
                  value={form.userName}
                  className="my-1"
                  type='text'
                  placeholder='Nombre de usuario'
                  onChange={(e) => { setForm({ ...form, userName: e.target.value }) }} fullWidth />
              </Grid>
              <Grid xs={12} item>
                <Input
                  value={form.password}
                  className="my-1"
                  type='password'
                  placeholder='contraseña'
                  fullWidth
                  onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                />
              </Grid>

              <FormControl className="my-1" fullWidth >
                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                <Select
                  disabled={update}
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
                  disabled={update}
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
              <Button variant='contained' type='submit'>{update ? 'Actualizar' : 'Crear'}</Button>
              {update && <Button variant='contained' className="mx-1" onClick={() => {
                setForm({
                  email: '',
                  userName: '',
                  password: '',
                  role: '',
                  store: '',
                })
                setupdate(false)
              }}>Cancelar</Button>}
            </form>
          </Grid>
          <Grid xs={6} item>
            <Grid xs={12}>
              <Paper elevation={2}>
                {users.length > 0 && users?.map(el => (
                  <Card key={el._id} className="my-2 shadow-none">
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} gutterBottom>
                        {el.email} {el.fullName}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        tienda: {el.store}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Role:{el.role}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => {
                        setupdate(true)
                        setForm({
                          email: el.email,
                          userName: el.fullName,
                          password: '',
                          role: el.role,
                          store: el.store,
                        })
                      }}>Editar</Button>
                    </CardActions>
                  </Card>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  </Grid>)
}