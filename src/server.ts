import app from './app'

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);

})