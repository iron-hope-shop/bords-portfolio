import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingState } from './LoadingState';
import { Highlight } from './Highlight';
import {
  TruncatedText,
  InfoBox,
  ImageContainer,
  ContentContainer,
  Tabs,
  Tab,
  Content,
  ContentPanel,
  StyledModal,
  CloseButton
} from './ResultCard.styles';
import RxnImg from '../RxnImg/RxnImg';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { parseIdentifiers, parseProvenance, parseInputs, parseOutcomes, parseNotes } from './helpers';

// Helper functions remain the same
const hasHighlight = (content, searchTerm) => {
  if (!content || !searchTerm) return false;
  if (typeof content === 'string') {
    return content.toLowerCase().includes(searchTerm.toLowerCase());
  }
  if (React.isValidElement(content)) {
    return hasHighlight(content.props.children, searchTerm);
  }
  if (Array.isArray(content)) {
    return content.some(item => hasHighlight(item, searchTerm));
  }
  return String(content).toLowerCase().includes(searchTerm.toLowerCase());
};

const renderContent = (content, searchTerm) => {
  if (!content) return null;
  if (typeof content === 'string') {
    return <Highlight text={content} searchTerm={searchTerm} />;
  }
  if (React.isValidElement(content)) {
    return React.cloneElement(content, {
      children: renderContent(content.props.children, searchTerm)
    });
  }
  if (Array.isArray(content)) {
    return content.map((item, index) => (
      <React.Fragment key={index}>
        {renderContent(item, searchTerm)}
      </React.Fragment>
    ));
  }
  return String(content);
};

const ResultCard = ({ data, searchedTerm, isLoading, onClick }) => {
  const [activeTab, setActiveTab] = useState('inputs');
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  if (isLoading) {
    return <LoadingState />;
  }

  const handleTabClick = (tabId) => {
    if (window.gtag) {
      window.gtag('event', 'tab_switch', {
        result_id: data?.reaction_id?.raw,
        from_tab: activeTab,
        to_tab: tabId,
        search_term: searchedTerm
      });
    }
    setActiveTab(tabId);
  };

  const handleImageClick = () => {
    if (window.gtag) {
      window.gtag('event', 'image_view', {
        result_id: data?.reaction_id?.raw,
        search_term: searchedTerm,
        smiles: data?.identifiers?.raw
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (window.gtag) {
      window.gtag('event', 'close_image_modal', {
        result_id: data?.reaction_id?.raw,
        search_term: searchedTerm
      });
    }
    setModalOpen(false);
  };

  const handleCopy = (textCopied) => {
    if (window.gtag) {
      window.gtag('event', 'copy_content', {
        result_id: data?.reaction_id?.raw,
        content_type: textCopied === data.id.raw ? 'dataset_id' :
                     textCopied === data.reaction_id.raw ? 'reaction_id' :
                     'reaction_smiles',
        search_term: searchedTerm
      });
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardClick = (event) => {
    // Prevent tracking clicks on copy buttons or tabs
    if (
      event.target.closest('button') ||
      event.target.closest('[role="tab"]')
    ) {
      return;
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  const parsedIdentifiers = data?.identifiers?.raw ? parseIdentifiers(data.identifiers.raw) : null;
  const parsedProvenance = data?.provenance?.raw ? parseProvenance(data.provenance.raw) : null;
  const parsedInputs = data?.inputs?.raw ? parseInputs(data.inputs.raw) : null;
  const parsedOutcomes = data?.outcomes?.raw ? parseOutcomes(data.outcomes.raw) : null;
  const parsedNotes = data?.notes?.raw ? parseNotes(data.notes.raw) : null;

  // Check for highlights in each tab's content
  const highlightedTabs = {
    info: hasHighlight(parsedIdentifiers, searchedTerm) || hasHighlight(parsedProvenance, searchedTerm) || hasHighlight(data.id.raw, searchedTerm) || hasHighlight(data.reaction_id.raw, searchedTerm),
    inputs: hasHighlight(parsedInputs, searchedTerm),
    outputs: hasHighlight(parsedOutcomes, searchedTerm),
    notes: hasHighlight(parsedNotes, searchedTerm)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleCardClick}
    >
      <InfoBox sx={{mb: 6}}>
        <ImageContainer onClick={handleImageClick}>
          <RxnImg smiles={parsedIdentifiers} />
        </ImageContainer>
        <ContentContainer>
          <Tabs>
            {['inputs', 'outputs', 'notes', 'info'].map((tab) => (
              <Tab
                key={tab}
                active={activeTab === tab ? 'true' : undefined}
                onClick={() => handleTabClick(tab)}
                role="tab"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {highlightedTabs[tab] && searchedTerm && '*'}
              </Tab>
            ))}
          </Tabs>
          <Content>
            <ContentPanel active={activeTab === 'info' ? 'true' : undefined}>
              <div style={{ display: 'flex', alignItems: 'center', paddingBottom: 8 }}>
                {parsedIdentifiers ? <>
                  <CopyToClipboard 
                    text={parsedIdentifiers} 
                    onCopy={() => handleCopy(parsedIdentifiers)}
                  >
                    <IconButton color="primary">
                      <ContentCopyIcon />
                    </IconButton>
                  </CopyToClipboard>
                  <TruncatedText>Reaction SMILES: {renderContent(parsedIdentifiers, searchedTerm)}</TruncatedText>
                </> : "No Rxn SMILES. SMILES strings may be present in another tab."}
              </div>
              {renderContent(parsedProvenance, searchedTerm)}
              <pre></pre>
              <div style={{ fontFamily: 'sans-serif' }}>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ width: 92 }}>Dataset:</td>
                      <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                        <CopyToClipboard 
                          text={data.id.raw} 
                          onCopy={() => handleCopy(data.id.raw)}
                        >
                          <IconButton color="primary" size="small">
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </CopyToClipboard>
                        {renderContent(data.id.raw, searchedTerm)}
                      </td>
                    </tr>
                    <tr>
                      <td>ID:</td>
                      <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', display: 'flex', alignItems: 'center' }}>
                        <CopyToClipboard 
                          text={data.reaction_id.raw} 
                          onCopy={() => handleCopy(data.reaction_id.raw)}
                        >
                          <IconButton color="primary" size="small">
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </CopyToClipboard>
                        {renderContent(data.reaction_id.raw, searchedTerm)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ContentPanel>
            <ContentPanel active={activeTab === 'inputs' ? 'true' : undefined}>
              {renderContent(parsedInputs, searchedTerm)}
            </ContentPanel>
            <ContentPanel active={activeTab === 'outputs' ? 'true' : undefined}>
              {renderContent(parsedOutcomes, searchedTerm)}
            </ContentPanel>
            <ContentPanel active={activeTab === 'notes' ? 'true' : undefined}>
              {renderContent(parsedNotes, searchedTerm)}
            </ContentPanel>
          </Content>
        </ContentContainer>
        <StyledModal 
          open={modalOpen} 
          onClose={handleCloseModal}
        >
          <div>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <ImageContainer>
              <RxnImg smiles={parsedIdentifiers} />
            </ImageContainer>
          </div>
        </StyledModal>
      </InfoBox>
    </motion.div>
  );
};

export default ResultCard;