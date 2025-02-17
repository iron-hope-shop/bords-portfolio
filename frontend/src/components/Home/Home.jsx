import React from 'react';
import { Typography, Grid, Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FilterAlt, AddCircle, Api } from '@mui/icons-material';
import {
  InfoBox,
  ContentContainer,
  Content
} from './Home.styles';

function Home() {
  return (
    <InfoBox>
      <ContentContainer>
        <Content>
          <Box mb={6}>
            <Typography variant="h4" component="h1" gutterBottom align="left" sx={{ fontWeight: 'bold' }}>
              Big Open Reaction Database Search
            </Typography>
            <Typography variant="h6" align="left" color="textSecondary" paragraph>
              Empowering chemical research with comprehensive, open-access reaction data
            </Typography>
          </Box>

          <Box mb={4}>
            <Typography variant="body1" paragraph>
              The Big Open Reaction Database Search (BORDS) is a powerful search platform built on the foundation of <a href="https://github.com/open-reaction-database">Google's Open Reaction Database (ORD)</a>. We provide researchers with easy access to a vast collection of chemical reaction data, supporting machine learning and related efforts in reaction prediction, chemical synthesis planning, and experiment design.
            </Typography>
          </Box>

          <Grid container spacing={4} mb={6}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  2,149,741
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Total reactions catalogued
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Comprehensive Coverage
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Single-step organic reactions, including medicinal, process, flow, photo-, and electrochemistry
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Open Access
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  All data freely available under CC-BY-SA license
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Key Features:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Structured data format for chemical reaction information
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Advanced search capabilities for reactants, products, and conditions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Support for time-course data and unstructured analytical data
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Regular updates from the ORD GitHub repository
                </Typography>
              </li>
            </ul>
          </Box>

          <Box mb={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Roadmap:
            </Typography>
            <Paper elevation={3} sx={{ p: 3 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <FilterAlt color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Advanced Chemical Structure Filters"
                    secondary="Implement SMILES, InChI, and substructure search capabilities for precise molecular querying"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AddCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="User-Submitted Reactions"
                    secondary="Develop a user-friendly interface for researchers to contribute their own reaction data to the database"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Api color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Machine Learning API"
                    secondary="Launch a RESTful API for seamless integration with ML models and cheminformatics tools"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>

          <Box mt={4}>
            <Typography variant="body1" align="left" color="textSecondary">
              Enter a search term above to explore our extensive database and accelerate your chemical discoveries.
            </Typography>
          </Box>
        </Content>
      </ContentContainer>
    </InfoBox>
  );
}

export default Home;