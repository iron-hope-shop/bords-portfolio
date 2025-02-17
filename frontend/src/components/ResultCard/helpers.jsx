// helpers.jsx
import { PubChemLink } from "./PubChemLink";

const formatOutcomes = (outcomes) => {
  return outcomes.map((outcome, idx) => (
    <div key={idx} className="mb-4">
      {outcome.reaction_time && (
        <div className="mb-2">
          Reaction Time: {outcome.reaction_time.value} {outcome.reaction_time.units?.toLowerCase()}
        </div>
      )}
      
      {outcome.products?.map((product, prodIdx) => {
        const name = product?.identifiers?.find(id => id?.type === "NAME")?.value || "Unknown";
        const smiles = product?.identifiers?.find(id => id?.type === "SMILES")?.value || "N/A";
        const inchi = product?.identifiers?.find(id => id?.type === "INCHI")?.value || "N/A";
        
        return (
          <div key={`product-${prodIdx}`} className="mb-4">
            <PubChemLink smiles={smiles}>
              {`Product ${prodIdx + 1}: ${name}`}
            </PubChemLink>
            <div className="ml-4">
              <div>- SMILES: {smiles}</div>
              <div>- InChI: <a href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(inchi)}`} target="_blank" rel="noopener noreferrer">{inchi}</a></div>
              {product.measurements?.map((m, i) => {
                if (!m) return null;
                
                let measurementText = '';
                if (m.type === "AMOUNT" && m.details === "MASS") {
                  measurementText = "- Amount: Measurement details not available";
                } else if (m.type === "YIELD" && m.details === "PERCENTYIELD" && m.percentage) {
                  measurementText = `- Yield: ${m.percentage.value}%`;
                }
                
                return measurementText ? <div key={i}>{measurementText}</div> : null;
              })}
              {product.isolated_color && <div>- Color: {product.isolated_color}</div>}
              {product.texture && <div>- Texture: {product.texture.details || product.texture.type}</div>}
            </div>
          </div>
        );
      })}
    </div>
  ));
};

const formatInputs = (inputs) => {
  const formattedInputs = [];
  let reactantCount = 1;
  let solventCount = 1;
  let otherCount = 1;

  for (const [key, value] of Object.entries(inputs)) {
    if (value && Array.isArray(value.components)) {
      for (const component of value.components) {
        const name = component.identifiers.find(id => id.type === "NAME")?.value || "Unknown";
        const smiles = component.identifiers.find(id => id.type === "SMILES")?.value || "N/A";
        const inchi = component.identifiers.find(id => id.type === "INCHI")?.value || "N/A";
        let amount = "";
        if (component.amount.mass) {
          amount = `${component.amount.mass.value} ${component.amount.mass.units.toLowerCase()}`;
        } else if (component.amount.volume) {
          amount = `${component.amount.volume.value} ${component.amount.volume.units.toLowerCase()}`;
        } else if (component.amount.moles) {
          amount = `${component.amount.moles.value} ${component.amount.moles.units.toLowerCase()}`;
        }

        let prefix;
        switch (component.reaction_role) {
          case "REACTANT": prefix = `Reactant ${reactantCount++}`; break;
          case "SOLVENT": prefix = `Solvent ${solventCount++}`; break;
          default: prefix = `Other ${otherCount++}`;
        }

        formattedInputs.push(
          <div key={`${prefix}-${name}`} className="mb-4">
            <PubChemLink smiles={smiles}>
              {`${prefix}: ${name}`}
            </PubChemLink>
            <div className="ml-4">
              <div>- AMOUNT: {amount === "" || amount === undefined ? "N/A" : amount}</div>
              <div>- SMILES: {smiles}</div>
              <div>- InChI: <a href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(inchi)}`} target="_blank" rel="noopener noreferrer">{inchi}</a></div>
              <br/><br/>
            </div>
          </div>
        );
      }
    }
  }

  return <div className="space-y-4">{formattedInputs}</div>;
};

const parseIdentifiers = (dataIdentifiers) => {
  const identifiers = JSON.parse(dataIdentifiers);
  
  const reactionCxsmiles = identifiers.find(identifier => identifier.type === "REACTION_CXSMILES");
  
  return reactionCxsmiles ? reactionCxsmiles.value : "";
}

const parseProvenance = (dataProvenance) => {
  const provenance = JSON.parse(dataProvenance);
  const doi = provenance.doi || 'N/A';
  const patent = provenance.patent || 'N/A';
  const recordCreatedTime = provenance.record_created?.time?.value ? new Date(provenance.record_created.time.value).toLocaleDateString('en-US') : 'N/A';
  const recordCreatedPersonName = provenance.record_created?.person?.name || 'N/A';
  const recordCreatedPersonOrganization = provenance.record_created?.person?.organization || 'N/A';
  const recordCreatedPersonEmail = provenance.record_created?.person?.email || 'N/A';

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <table>
        <tbody>
          <tr>
            <td style={{width: 92}}>doi:</td>
            <td>{doi}</td>
          </tr>
          <tr>
            <td>Patent:</td>
            <td>{patent}</td>
          </tr>
          <tr>
            <td>Recorded:</td>
            <td>{`${recordCreatedTime} by ${recordCreatedPersonName} (${recordCreatedPersonOrganization})`}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{recordCreatedPersonEmail !== 'N/A' ? <a href={`mailto:${recordCreatedPersonEmail}`}>{recordCreatedPersonEmail}</a> : 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const parseInputs = (dataInputs) => {
  const formattedInputs = formatInputs(JSON.parse(dataInputs));
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formattedInputs}</pre>
  );
}

const parseOutcomes = (dataOutcomes) => {
  const parsedOutcomes = JSON.parse(dataOutcomes);
  const formattedOutcomes = formatOutcomes(parsedOutcomes);
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{formattedOutcomes}</pre>
  );
}

const parseNotes = (dataNotes) => {
  try {
    const parsedNotes = JSON.parse(dataNotes);
    return (
      <p className="caption">
        {Object.values(parsedNotes).join('\n')}
      </p>
    );
  } catch (error) {
    return (
      <pre className="caption">Something unexpected happened.</pre>
    );
  }
}

const highlight = ({ text = '', searchTerm = '' }) => {
  if (!searchTerm || !text) return text;

  const parts = text.toString().split(new RegExp(`(${searchTerm})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === searchTerm.toLowerCase()
      ? <mark key={i} style={{ backgroundColor: 'yellow', border: "2px solid yellow" }}>{part}</mark>
      : part
  );
};

export { parseIdentifiers, parseProvenance, parseInputs, parseOutcomes, parseNotes, highlight };
