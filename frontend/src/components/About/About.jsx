import React from 'react';
import { Typography, Box, Paper, Divider, Button, Link } from '@mui/material';
import { Email, Lightbulb, Description } from '@mui/icons-material';
import {
  InfoBox,
  ContentContainer,
  Content
} from './About.styles';

function About() {
  return (
    <InfoBox>
      <ContentContainer>
        <Content>
          <Box mb={6}>
            <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              About BORDS
            </Typography>

          <Box mt={4}>
            <Typography variant="body1" align="center" color="textSecondary">
              Start exploring our extensive database now and accelerate your chemical discoveries. Your next breakthrough might be just a search away!
            </Typography>
          </Box>
          </Box>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              The Big Open Reaction Database Search (BORDS) was born from a unique intersection of chemistry and computer science. With a father who's a chemist at a large company and my background in computer science, I saw an opportunity to enhance the Open Reaction Database's (ORD) search capabilities.
            </Typography>
            <Typography variant="body1" paragraph>
              The ORD website, while groundbreaking, has search times that can be improved. By leveraging modern web technologies and optimized search algorithms, BORDS aims to make chemical reaction data more accessible and easier to query than ever before.
            </Typography>
            <Typography variant="body1">
              Our mission is to provide researchers with lightning-fast, easy access to a vast collection of chemical reaction data, supporting machine learning and related efforts in reaction prediction, chemical synthesis planning, and experiment design.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Roadmap: Expanding BORDS Capabilities
            </Typography>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                1. Advanced Chemical Structure Filters
              </Typography>
              <Typography variant="body2" paragraph>
                We're implementing SMILES, InChI, and substructure search capabilities for precise molecular querying. This will allow researchers to find exactly the reactions they need with unprecedented accuracy, particularly useful for medicinal chemists looking for specific functional group transformations or process chemists optimizing synthetic routes.
              </Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                2. User-Submitted Reactions
              </Typography>
              <Typography variant="body2" paragraph>
                We're developing a user-friendly interface for researchers to contribute their own reaction data to BORDS/ORD. This collaborative approach will help expand our dataset and provide a platform for sharing cutting-edge research, fostering a community of chemists who can share insights, validate results, and accelerate the pace of chemical discovery.
              </Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                3. Machine Learning API
              </Typography>
              <Typography variant="body2" paragraph>
                We're launching a RESTful API for seamless integration with ML models and cheminformatics tools. This API will serve data from our Elasticsearch backend, providing a powerful resource for researchers and developers working on predictive models, retrosynthesis algorithms, and other AI-driven chemistry applications.
              </Typography>
              <Typography variant="body2">
                Potential uses include:
                <ul>
                  <li>Training reaction prediction models</li>
                  <li>Developing synthesis planning tools</li>
                  <li>Creating interactive visualization tools for reaction networks</li>
                  <li>Building automated literature review systems for chemists</li>
                </ul>
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Get Involved
            </Typography>
            <Typography variant="body1" paragraph>
              We're always looking for new ideas and collaborations to improve BORDS. Whether you're a chemist with insights on useful features, a developer with ideas for API applications, or a researcher interested in contributing data, we'd love to hear from you!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Email />}
                href="mailto:me@brad-jackson.com"
              >
                Contact Us
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Lightbulb />}
                href="mailto:me@brad-jackson.com"
              >
                Submit an Idea
              </Button>
            </Box>
          </Paper>


          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Data License
            </Typography>
            <Typography variant="body1" paragraph>
              The reaction data in BORDS is sourced from the Open Reaction Database (ORD) and is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0).
            </Typography>
            <Typography variant="body1" paragraph>
              This means you are free to:
            </Typography>
            <ul>
              <li>Share — copy and redistribute the material in any medium or format</li>
              <li>Adapt — remix, transform, and build upon the material for any purpose, even commercially</li>
            </ul>
            <Typography variant="body1" paragraph>
              Under the following terms:
            </Typography>
            <ul>
              <li>Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.</li>
              <li>ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.</li>
            </ul>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Description />}
                component={Link}
                href="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read Full License
              </Button>
            </Box>
          </Paper>

          <Box mt={4}>
            <Typography variant="body1" align="center" color="textSecondary">
              By using BORDS, you agree to comply with the terms of the CC BY-SA 4.0 license for all data sourced from the Open Reaction Database.
            </Typography>
          </Box>
        </Content>
      </ContentContainer>
    </InfoBox>
  );
}

export default About;