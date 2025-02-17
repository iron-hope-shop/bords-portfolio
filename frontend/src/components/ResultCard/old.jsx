import React, { useState, useEffect } from 'react';
import {
  InfoBox,
  ImageContainer,
  ContentContainer,
  Tabs,
  Tab,
  Content,
  ContentPanel,
  Item,
  ItemHeader,
  ItemContent,
  ItemContentInner,
  StyledModal,
  ModalContent,
  CloseButton
} from './ResultCard.styles';

const ResultCard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('common');
  const [expandedItems, setExpandedItems] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // useEffect(() => {
  //   const initialExpandedState = {};
  //   ['inputs', 'outcomes'].forEach(category => {
  //     data[category].forEach((item, index) => {
  //       initialExpandedState[`${category}-${index}`] = false;
  //     });
  //   });
  //   setExpandedItems(initialExpandedState);
  // }, [data]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleItemClick = (category, index) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }));
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <InfoBox>
      <ImageContainer onClick={handleImageClick}>
        <img src={`https://picsum.photos/800/200?random=${data.id}`} alt="Chemistry Reaction Diagram" />
      </ImageContainer>
      <ContentContainer>
        <Tabs>
          {['common', 'inputs', 'outcomes', 'notes'].map((tab) => (
            <Tab
              key={tab}
              active={activeTab === tab}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tab>
          ))}
        </Tabs>
        <Content>
          <ContentPanel active={activeTab === 'common'}>
            {/* <p>{data.common.content}</p> */}
            {JSON.stringify(data)}
          </ContentPanel>
          <ContentPanel active={activeTab === 'inputs'}>
            {/* {data.inputs.map((input, index) => (
              <Item key={index}>
                <ItemHeader onClick={() => handleItemClick('inputs', index)}>
                  {input.name}
                </ItemHeader>
                <ItemContent active={expandedItems[`inputs-${index}`]}>
                  <ItemContentInner>
                    {Object.entries(input.details).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </ItemContentInner>
                </ItemContent>
              </Item>
            ))} */}
          </ContentPanel>
          <ContentPanel active={activeTab === 'outcomes'}>
            {/* {data.outcomes.map((outcome, index) => (
              <Item key={index}>
                <ItemHeader onClick={() => handleItemClick('outcomes', index)}>
                  {outcome.name}
                </ItemHeader>
                <ItemContent active={expandedItems[`outcomes-${index}`]}>
                  <ItemContentInner>
                    {Object.entries(outcome.details).map(([key, value]) => (
                      <p key={key}><strong>{key}:</strong> {value}</p>
                    ))}
                  </ItemContentInner>
                </ItemContent>
              </Item>
            ))} */}
          </ContentPanel>
          <ContentPanel active={activeTab === 'notes'}>
            {/* <p>{data.notes}</p> */}
          </ContentPanel>
        </Content>
      </ContentContainer>
      <StyledModal
        open={modalOpen}
        onClose={handleCloseModal}
      >
        <div>
          <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
          <ModalContent src={`https://picsum.photos/1080/1080?random=${data.id}`} alt="Expanded Chemistry Reaction Diagram" />
        </div>
      </StyledModal>
    </InfoBox>
  );
};

export default ResultCard;