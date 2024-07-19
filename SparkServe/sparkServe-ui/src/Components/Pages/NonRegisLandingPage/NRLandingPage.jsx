import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavBar from '../../UserNavBar/UserNavBar';
import { Container, Grid, Button, Box, IconButton } from '@mui/material';
import Footer from '../../Footer/Footer';
import Cards from '../../Cards/Cards';
import { posts } from '../../DumyData/DummyData';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const NRLandingPage = () => {
    const navigate = useNavigate();

    const handleMapClick = () => {
        navigate('/Map');
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <>
            <UserNavBar />
            <Box
                sx={{
                    background: 'linear-gradient(to bottom, #4685f6, white)',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Container>
                    <Grid
                        container
                        rowSpacing={4}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {posts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <Cards
                                    className="Cards"
                                    title={post.title}
                                    cover={post.cover}
                                    author={post.author}
                                    view={post.view}
                                    comment={post.comment}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 2,
                            marginBottom: 2,
                        }}
                    >
                        <IconButton
                            color="primary"
                            onClick={handleBackClick}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginBottom: 2 }}
                        onClick={handleMapClick}
                    >
                        Search by Map
                    </Button>
                </Container>
            </Box>
            <Footer />
        </>
    );
};

export default NRLandingPage;


