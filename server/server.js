const express = require('express'), helmet = require('helmet'), morgan = require('morgan'), mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

const db = require('./config/keys.js').mongoURI;
mongoose.connect(db, {useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'))
.catch(error => console.log(error));


app.use(morgan('common'));
app.use(helmet());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello')
});
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})