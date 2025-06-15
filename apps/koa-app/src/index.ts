import app from './app';

const PORT = process.env.APP_PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
