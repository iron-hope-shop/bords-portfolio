// LoadingState.jsx
import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { InfoBox, ImageContainer, ContentContainer, Tabs, Tab, Content, ContentPanel } from './ResultCard.styles';

export const LoadingState = () => (
  <InfoBox>
    <Box sx={{ height: 300, bgcolor: 'grey.100' }}>
      <Skeleton variant="rectangular" height="100%" />
    </Box>
    <ContentContainer>
      <Tabs>
        {['Info', 'Inputs', 'Outputs', 'Notes'].map((tab) => (
          <Tab key={tab} sx={{ opacity: 0.5 }}>{tab}</Tab>
        ))}
      </Tabs>
      <Content>
        <ContentPanel active="true">
          <Box sx={{ p: 2, '& > *': { mb: 2 } }}>
            <Skeleton height={24} width="75%" />
            <Skeleton height={24} />
            <Skeleton height={24} width="66%" />
            <Box sx={{ mt: 3 }}>
              <Skeleton height={20} width="50%" />
              <Skeleton height={20} width="33%" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </ContentPanel>
      </Content>
    </ContentContainer>
  </InfoBox>
);