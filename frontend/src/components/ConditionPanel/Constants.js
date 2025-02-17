export const fieldConditions = {
    'REACTION_CXSMILES': [
      { value: '=', placeholder: 'Enter SMARTS' },
      { value: 'CONTAINS_SUBSTRUCTURE', placeholder: 'Enter SMILES or SMARTS' },
      { value: 'DOES_NOT_CONTAIN_SUBSTRUCTURE', placeholder: 'Enter SMILES or SMARTS' }
    ],
    'REACTION_CXSMILES.REACTANTS': [
      { value: 'CONTAINS_SUBSTRUCTURE', placeholder: 'Enter SMILES or SMARTS' },
      { value: 'DOES_NOT_CONTAIN_SUBSTRUCTURE', placeholder: 'Enter SMILES or SMARTS' }
    ],
    'REACTION_CXSMILES.PRODUCTS': [
      { value: 'CONTAINS_SUBSTRUCTURE', placeholder: 'Enter SMILES or SMARTS' },
      { value: 'DOES_NOT_CONTAIN_SUBSTRUCTURE', placeholder: 'Enter SMILES or SMARTS' }
    ],
    'conditions': [
      { value: 'CONTAINS', placeholder: 'Enter condition text' }
    ],
    'reaction_id': [
      { value: '=', placeholder: 'Enter reaction ID' }
    ],
    'provenance doi': [
      { value: '=', placeholder: 'Enter DOI' },
      { value: 'CONTAINS', placeholder: 'Enter DOI text' }
    ],
    'provenance patent': [
      { value: 'EXISTS', placeholder: 'true or false' },
      { value: '=', placeholder: 'Enter patent number' }
    ],
    'outcomes reaction_time': [
      { value: '=', placeholder: 'Enter time in milliseconds' },
      { value: '>', placeholder: 'Enter minimum time in ms' },
      { value: '<', placeholder: 'Enter maximum time in ms' }
    ],
    'inputs': [
      { value: 'CONTAINS', placeholder: 'Enter input text' }
    ],
    'workups': [
      { value: 'CONTAINS', placeholder: 'Enter workup text' }
    ],
    'notes': [
      { value: 'CONTAINS', placeholder: 'Enter note text' }
    ],
    'ALL FIELDS': [
      { value: 'CONTAINS', placeholder: 'Enter search text' }
    ]
  };