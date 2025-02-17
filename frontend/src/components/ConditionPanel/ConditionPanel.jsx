import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, TextField, Typography, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledConditionPanel, StyledConditionItem, StyledSelect, StyledTextField } from './ConditionPanel.styles';
import { fieldConditions } from './Constants';
import CheckIcon from '@mui/icons-material/Check';

const fields = Object.keys(fieldConditions);

function ConditionCondition({ condition, onDelete, isLast, onChange }) {
  const [selectedField, setSelectedField] = useState(fields[0]);
  const [selectedCondition, setSelectedCondition] = useState(fieldConditions[fields[0]][0].value);
  const [value, setValue] = useState('');

  const handleFieldChange = (event) => {
    const newField = event.target.value;
    setSelectedField(newField);
    setSelectedCondition(fieldConditions[newField][0].value);
    onChange({ field: newField, condition: fieldConditions[newField][0].value, value });
  };

  const handleConditionChange = (event) => {
    setSelectedCondition(event.target.value);
    onChange({ field: selectedField, condition: event.target.value, value });
  };

  const handleValueChange = (event) => {
    setValue(event.target.value);
    onChange({ field: selectedField, condition: selectedCondition, value: event.target.value });
  };

  const getCurrentPlaceholder = () => {
    const currentConditions = fieldConditions[selectedField];
    const currentCondition = currentConditions.find(cond => cond.value === selectedCondition);
    return currentCondition ? currentCondition.placeholder : 'Enter value';
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={4} md={3}>
        <StyledSelect
          fullWidth
          value={selectedField}
          onChange={handleFieldChange}
        >
          {fields.map(field => (
            <MenuItem key={field} value={field}>{field}</MenuItem>
          ))}
        </StyledSelect>
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <StyledSelect
          fullWidth
          value={selectedCondition}
          onChange={handleConditionChange}
        >
          {fieldConditions[selectedField].map(cond => (
            <MenuItem key={cond.value} value={cond.value}>{cond.value}</MenuItem>
          ))}
        </StyledSelect>
      </Grid>
      <Grid item xs={12} sm={4} md={3}>
        <StyledTextField
          fullWidth
          placeholder={getCurrentPlaceholder()}
          value={value}
          onChange={handleValueChange}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <IconButton onClick={onDelete} color="secondary" size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
}

function ConditionGroup({ group, onDelete, onAddAnd, onAddOr, isLast, onAddCondition, onUpdateCondition }) {
  return (
    <>
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2 }}>
      {group.conditions.map((condition, index) => (
        <React.Fragment key={condition.id}>
          {index !== 0 && (
            <Typography variant="subtitle2" align="left" my={1}>
              {condition.operator}
            </Typography>
          )}
          <ConditionCondition
            condition={condition}
            onDelete={() => onDelete(group.id, condition.id)}
            isLast={index === group.conditions.length - 1}
            onChange={(updatedCondition) => onUpdateCondition(group.id, condition.id, updatedCondition)}
          />
        </React.Fragment>
      ))}
      <Box mt={2}>
        <Button onClick={() => onAddCondition(group.id, 'AND')} variant="outlined" size="small" sx={{ mr: 1 }}>
          AND Condition
        </Button>
        <Button onClick={() => onAddCondition(group.id, 'OR')} variant="outlined" size="small">
          OR Condition
        </Button>
      </Box>
    </Box>
      {isLast && (
        <Box mt={2}>
          <Button onClick={() => onAddAnd(group.id)} variant="outlined" size="small" sx={{ mr: 1 }}>
            AND Group
          </Button>
          <Button onClick={() => onAddOr(group.id)} variant="outlined" size="small">
            OR Group
          </Button>
        </Box>
      )}
    </>
  );
}

function ConditionPanel({ open, onApplyConditions }) {
  const [conditionGroups, setConditionGroups] = useState([]);

  if (!open) return null;

  const addGroup = (operator) => {
    setConditionGroups([...conditionGroups, { id: Date.now(), operator, conditions: [{ id: Date.now() }] }]);
  };

  const clearConditions = () => {
    setConditionGroups([]);
  };

  const deleteCondition = (groupId, conditionId) => {
    setConditionGroups(conditionGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.filter(condition => condition.id !== conditionId)
        };
      }
      return group;
    }).filter(group => group.conditions.length > 0));
  };

  const addCondition = (groupId, operator) => {
    setConditionGroups(conditionGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: [...group.conditions, { id: Date.now(), operator }]
        };
      }
      return group;
    }));
  };

  const updateCondition = (groupId, conditionId, updatedCondition) => {
    setConditionGroups(conditionGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(condition => 
            condition.id === conditionId ? { ...condition, ...updatedCondition } : condition
          )
        };
      }
      return group;
    }));
  };

  const addAndGroup = (groupId) => {
    const index = conditionGroups.findIndex(group => group.id === groupId);
    setConditionGroups([
      ...conditionGroups.slice(0, index + 1),
      { id: Date.now(), operator: 'AND', conditions: [{ id: Date.now() }] },
      ...conditionGroups.slice(index + 1)
    ]);
  };

  const addOrGroup = (groupId) => {
    const index = conditionGroups.findIndex(group => group.id === groupId);
    setConditionGroups([
      ...conditionGroups.slice(0, index + 1),
      { id: Date.now(), operator: 'OR', conditions: [{ id: Date.now() }] },
      ...conditionGroups.slice(index + 1)
    ]);
  };

  const applyConditions = () => {
    const formattedConditions = conditionGroups.map(group => ({
      operator: group.operator,
      conditions: group.conditions.map(condition => ({
        field: condition.field,
        condition: condition.condition,
        value: condition.value
      }))
    }));
    onApplyConditions(formattedConditions);
  };

  return (
    <StyledConditionPanel>
      <Typography variant="h6" gutterBottom>Search Conditions</Typography>
      {conditionGroups.map((group, index) => (
        <React.Fragment key={group.id}>
          {index !== 0 && (
            <Typography variant="subtitle1" align="center" my={1}>
              {group.operator}
            </Typography>
          )}
          <ConditionGroup
            group={group}
            onDelete={deleteCondition}
            onAddAnd={addAndGroup}
            onAddOr={addOrGroup}
            isLast={index === conditionGroups.length - 1}
            onAddCondition={addCondition}
            onUpdateCondition={updateCondition}
          />
        </React.Fragment>
      ))}

      <Box mt={2} mb={3} display="flex" justifyContent="flex-start">
        <Button
          endIcon={conditionGroups.length === 0 ? <AddIcon /> : <DeleteIcon />}
          onClick={conditionGroups.length === 0 ? () => addGroup('AND') : clearConditions}
          variant="contained"
          color="primary"
          style={{ marginRight: '10px' }}
        >
          {conditionGroups.length === 0 ? "Add Group" : "Clear all"}
        </Button>
        {conditionGroups.length !== 0 && (
          <Button variant="contained" color="primary" endIcon={<CheckIcon />} onClick={applyConditions}>
            Apply
          </Button>
        )}
      </Box>
    </StyledConditionPanel>
  );
}

export default ConditionPanel;