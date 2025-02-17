```shell
npm run dev

npm run build
npm run preview

gcloud app deploy
```


BORDS = better ORD search

TODO
<!-- 1. crude parsing -->
<!-- 2. fit to new styling/dropdowns https://github.com/iron-hope-shop/bord-github/blob/master/frontend/src/components/ResultCard/ResultCard.jsx) --> SKIPPED
<!-- 3. rdkit -->
<!-- 4. pagination buttons -->
<!-- 5. hide filter panel -->
<!-- 6. deploy to dev -->
1. favicons/metadata <-- skipped -->
2. MVP done


# ENHANCEMENTS
<!-- thes are in no particular order, though some may be dependant on others -->
1. show && implement filters
2. add filters to param
3. rate limiting (for axios/pressing enter + direct url/refresh spamming)
4. rate limiting screen
5. CI
6. IN INPUTS/OUTCOMES ETC LINK TO INTERACTIVE PUBCHEM https://pubchem.ncbi.nlm.nih.gov/edit3/index.html?smiles=CC(C)(C1%3DCC%3DC(C%3DC1)OCC2CO2)C3%3DCC%3DC(C%3DC3)OCC4CO4
8. GET CID LIKE https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/CC(C)(C1=CC=C(C=C1)OCC2CO2)C3=CC=C(C=C3)OCC4CO4/cids/TXT
9. DOWNLOAD IMAGE IS https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=[CID]&t=s
   - t is either s, l, or custom https://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=2286&width=500&height=500
11. pubchem view example: https://pubchem.ncbi.nlm.nih.gov/edit3/index.html?smiles=[SMILES] ex CC(C)(C1=CC=C(C=C1)OCC2CO2)C3=CC=C(C=C3)OCC4CO4
12. improve search with highlights (automatically go to tab with match) -- can probably do this on the fly, highlighting the relevant text (rudimentary but quality of life improvement)
13. make overlay image have more options? to see the images for each reactant and product? inputs page will also link...
14. allow users to drill down, and ask about the image they are seeing to claude or chatgpt or something, and it will try to explain what it sees? disclaimer: could be wildly wrong
15. IMPROVE CARD LAYOUT IN INPUTS AND OUTPUTS TABS, side by side

<!-- NO 3. server-side rendering (SSR) with react dom rendered or w/e  -->

```jS
{/* 
FILTERS
-------

A && B
A || B
(A && B) && C
(A && B) || C
(A || B) && C
(A || B) || C
A && ((B || C) || D)



// IDENTIFIERS
note for smiles can probably use pubchem api to get their actual text aliases... i.e.
so, if it's not a SMILES string, try to convert their str to an alias and then
get the SMILES for that alias on pubchem... REACTION_CXSMILES are in SMARTS format

identifiers REACTION_CXSMILES = [ SMARTS ]
identifiers REACTION_CXSMILES CONTAINS/INCLUDES_SUBSTRUCTURE [ SMILES || SMARTS ]
identifiers REACTION_CXSMILES DOES_NOT_CONTAIN_SUBSTRUCTURE [ SMILES || SMARTS ]

----------------

// REACTANTS
identifiers REACTION_CXSMILES.REACTANTS CONTAINS/INCLUDES._SUBSTRUCTURE [ SMILES || SMARTS ]
identifiers REACTION_CXSMILES.REACTANTS DO_NOT_CONTAIN SUBSTRUCTURE [ SMILES || SMARTS ]

----------------

// PRODUCTS
identifiers REACTION_CXSMILES.PRODUCTS CONTAINS/INCLUDES_SUBSTRUCTURE [ SMILES || SMARTS ]
identifiers REACTION_CXSMILES.PRODUCTS DO_NOT_CONTAIN SUBSTRUCTURE [ SMILES || SMARTS ]

----------------

// CONDITIONS
conditions CONTAINS [text] // note, this is to be freeform text with a few options 
// if the user wants to search for stirring, temperature, etc. probably need to drop "conditions_are_dynamic" and
// "details" at the root level -- AND ONLY THE ROOT/PARENT lEVEL DETAILS

----------------

// REACTION_ID
reaction_id = [ text ]

----------------

// PROVENANCE
provenance doi = [doi_link] // account for http, https, no https, etc. and validate ptrn.
provenance doi CONTAINS [text]
provenance patent exists [ true || false ]
provenance patent = [ text ]

----------------

// OUTCOMES
outcomes reaction_time?.toMilliseconds() = [ value.toMilliseconds() ]
outcomes reaction_time?.toMilliseconds() > [ value.toMilliseconds() ]
outcomes reaction_time?.toMilliseconds() > [ value.toMilliseconds() ]
outcomes CONTAINS [ SMILES || NAME ] // send NAME to pubchem api to get SMILES

----------------

// INPUTS
inputs CONTAINS = [ str ]

----------------

// WORKUPS
workups CONTAINS = [ str ]

----------------

// NOTES
notes CONTAINS = [ str ]

----------------

// ALL FIELDS
ALL FIELDS CONTAINS [text]

----------------
NOTES---------->
----------------
//  - outcomes NUMBER_OF_RINGS = [ SMILES ] -- table this one for now... not sure if
// the total rings or rings of each outcome are relevant
// - logp?
// - SMARTS logical operators?
    // - # of bonds
    // - # of single bonds between atoms/which have single bonds?/connectivity
    // - hydrogen count

*/}
```

```shell
npm run dev

```
