import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt.js';
import CloseIcon from '@mui/icons-material/Close.js';
import CheckIcon from '@mui/icons-material/Check.js';
import { StyledAppBar, StyledToolbar, StyledHeading, StyledFilterButton, StyledMenuButton } from './TopBar.styles.js';
import SearchInput from '../SearchInput/SearchInput.jsx';
import MenuDrawer from '../MenuDrawer/MenuDrawer.jsx';
import { Typography } from '@mui/material';

import ConditionPanel from '../ConditionPanel/ConditionPanel.jsx';

function TopBar({ searchTerm, setSearchTerm, handleSearch, onApplyConditions }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    return (
        <>
            <StyledAppBar position="sticky">
                <StyledToolbar>
                    <div>
                        <StyledHeading variant="h6" component={Link} to="/" >
                            BORDS
                        </StyledHeading>
                        <Typography variant="subtitle2" component="div" style={{ fontSize: '0.6rem', marginTop: '-0.2rem', marginLeft: -8, textAlign: 'center' }}>
                            Big ORD Search
                        </Typography>
                    </div>
                    <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
                    {/* <StyledFilterButton onClick={toggleFilter}>
                        {isFilterOpen ? <CloseIcon /> : <FilterAltIcon />}
                    </StyledFilterButton>
                    {isFilterOpen ? (
                        <StyledMenuButton
                            edge="end">
                            <CheckIcon style={{ color: 'white' }} />
                        </StyledMenuButton>
                    ) : (
                        <MenuDrawer />
                    )} */}
                    <MenuDrawer />
                </StyledToolbar>
            </StyledAppBar>
            {/* <ConditionPanel open={isFilterOpen} onApplyConditions={onApplyConditions} /> */}
        </>
    )
}

export default TopBar;