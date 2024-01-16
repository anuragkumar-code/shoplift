
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/authRoutes');

const app = express();
const port = 4000;

app.use(cors());

// app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/auth', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

